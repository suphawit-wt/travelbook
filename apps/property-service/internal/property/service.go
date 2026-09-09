// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/property-service/internal/outbox"
	"github.com/suphawit-wt/travelbook/apps/property-service/internal/partner"
	"github.com/suphawit-wt/travelbook/apps/property-service/internal/search"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/secret"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/reviewclient"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
)

// CreateProperty defines the expected payload for creating a new property.
type CreateProperty struct {
	Name          string
	Slug          string
	Type          Type
	Timezone      string
	CheckInFrom   time.Time
	CheckInUntil  time.Time
	CheckOutFrom  time.Time
	CheckOutUntil time.Time
	PartnerID     uuid.UUID
}

// FileMetadata represents the metadata for a file that is required to generate a presigned URL for image uploads.
type FileMetadata struct {
	FileName    string
	ContentType string
	Size        uint32
}

// ImageUpload represents the details of a single image upload, including the presigned URL and the final image URL after upload.
type ImageUpload struct {
	ID        string
	Key       string
	UploadURL string
	ImageURL  string
}

// Service defines the business logic contract for property-related operations.
type Service interface {
	GetPropertyBySlug(
		ctx context.Context,
		propertySlug, checkIn, checkOut string,
		adults, children, room uint8,
		currencyCode string,
	) (*Detail, error)
	SearchProperties(
		ctx context.Context,
		destination, checkIn, checkOut string,
		adults, children, room uint8,
		page, perPage int,
		currencyCode string,
	) (properties []SearchProperty, totalCount int, hasNext bool, err error)
	CreateProperty(ctx context.Context, req *CreateProperty) (*Property, error)
	CreatePropertyImages(ctx context.Context, propertyID uuid.UUID, images []Image) error
	CreatePropertyRoom(ctx context.Context, propertyID uuid.UUID, req *CreatePropertyRoom) error
	CreateRatePlan(ctx context.Context, id uuid.UUID, ratePlan *CreateRatePlan) error
	ReserveProperty(ctx context.Context, req *ReserveRequest) (*ReserveResponse, error)
	GenerateImageUploadURLs(
		ctx context.Context,
		propertyID uuid.UUID,
		files []FileMetadata,
	) ([]ImageUpload, error)
	UpdateLocation(
		ctx context.Context,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		location *Location,
	) error
	UpdateDescription(
		ctx context.Context,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		description *Description,
	) error
	UpdatePolicies(
		ctx context.Context,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		policy *Policies,
	) error
	PublishProperty(ctx context.Context, partnerID, propertyID uuid.UUID) error
	UnpublishProperty(ctx context.Context, partnerID, propertyID uuid.UUID) error
}

type service struct {
	logger          *zaplog.Logger
	storageCfg      *config.StorageConfig
	s3PresignClient *s3.PresignClient
	propertyRepo    Repository
	searchRepo      search.Repository
	outboxRepo      outbox.Repository
	txMgr           database.TxManager
	reviewClient    reviewclient.Client
}

// NewService creates a new instance of Service with the provided dependencies.
func NewService(
	logger *zaplog.Logger,
	storageCfg *config.StorageConfig,
	s3PresignClient *s3.PresignClient,
	propertyRepo Repository,
	searchRepo search.Repository,
	outboxRepo outbox.Repository,
	txMgr database.TxManager,
	reviewClient reviewclient.Client,
) Service {
	return &service{
		logger:          logger,
		storageCfg:      storageCfg,
		s3PresignClient: s3PresignClient,
		propertyRepo:    propertyRepo,
		searchRepo:      searchRepo,
		outboxRepo:      outboxRepo,
		txMgr:           txMgr,
		reviewClient:    reviewClient,
	}
}

func (s *service) GetPropertyBySlug(
	ctx context.Context,
	propertySlug, checkIn, checkOut string,
	adults, children, room uint8,
	currencyCode string,
) (*Detail, error) {
	logger := s.logger.Named("get_property_by_slug")

	logger.Debug("fetching property details by slug",
		zap.String("slug", propertySlug),
		zap.String("check_in", checkIn),
		zap.String("check_out", checkOut),
		zap.Uint8("adults", adults),
		zap.Uint8("children", children),
		zap.Uint8("room", room),
		zap.String("currency", currencyCode),
	)

	parsedCheckIn, err := time.Parse(time.DateOnly, checkIn)
	if err != nil {
		logger.Warn("invalid check-in date format",
			zap.String("slug", propertySlug),
			zap.String("check_in", checkIn),
			zap.Error(err),
		)
		return nil, errs.NewBadRequestError("check in format not valid.")
	}
	parsedCheckOut, err := time.Parse(time.DateOnly, checkOut)
	if err != nil {
		logger.Warn("invalid check-out date format",
			zap.String("slug", propertySlug),
			zap.String("check_out", checkOut),
			zap.Error(err),
		)
		return nil, errs.NewBadRequestError("check out format not valid.")
	}

	if !parsedCheckOut.After(parsedCheckIn) {
		logger.Warn("invalid date range: check-out must be after check-in",
			zap.String("slug", propertySlug),
			zap.Time("check_in", parsedCheckIn),
			zap.Time("check_out", parsedCheckOut),
		)
		return nil, errs.NewBadRequestError("check out must be after check in")
	}

	nights := uint8(parsedCheckOut.Sub(parsedCheckIn).Hours() / 24)
	if nights <= 0 {
		logger.Warn("invalid stay duration calculated",
			zap.String("slug", propertySlug),
			zap.Uint8("nights", nights),
		)
		return nil, fmt.Errorf("invalid stay duration")
	}

	var propertyDetail *Detail
	err = s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		property, getErr := s.propertyRepo.GetBySlug(
			txCtx,
			tx,
			propertySlug,
			parsedCheckIn,
			parsedCheckOut,
			adults,
			children,
			room,
			nights,
			currencyCode,
		)
		if getErr != nil {
			logger.Error("failed to get property by slug from repository",
				zap.String("slug", propertySlug),
				zap.Error(getErr),
			)
			return err
		}

		propertyDetail = property
		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for get property by slug",
			zap.String("slug", propertySlug),
			zap.Error(err),
		)
		return nil, fmt.Errorf("Service.GetPropertyBySlug: %w", err)
	}

	reviewsRes, err := s.reviewClient.GetReviewsByPropertyID(ctx, propertyDetail.ID)
	if err != nil {
		logger.Error("failed to get reviews by property id",
			zap.String("propertyId", propertyDetail.ID),
			zap.Error(err),
		)
	}

	reviews := Review{}.FromListReviewResponse(reviewsRes)

	propertyDetail.Reviews = reviews

	logger.Info("successfully retrieved property details",
		zap.String("slug", propertySlug),
		zap.Uint8("nights", nights),
	)

	return propertyDetail, nil
}

func (s *service) SearchProperties(
	ctx context.Context,
	destination, checkIn, checkOut string,
	adults, children, room uint8,
	page, perPage int,
	currencyCode string,
) (finalProperties []SearchProperty, totalCount int, hasNext bool, err error) {
	logger := s.logger.Named("search_properties")

	logger.Debug("searching properties",
		zap.String("destination", destination),
		zap.String("check_in", checkIn),
		zap.String("check_out", checkOut),
		zap.Uint8("adults", adults),
		zap.Uint8("children", children),
		zap.Uint8("room", room),
		zap.Int("page", page),
		zap.Int("per_page", perPage),
		zap.String("currency", currencyCode),
	)

	parsedCheckIn, err := time.Parse(time.DateOnly, checkIn)
	if err != nil {
		logger.Warn("invalid check-in date format",
			zap.String("check_in", checkIn),
			zap.Error(err),
		)
		return nil, 0, false, errs.NewBadRequestError("check in format not valid.")
	}
	parsedCheckOut, err := time.Parse(time.DateOnly, checkOut)
	if err != nil {
		logger.Warn("invalid check-out date format",
			zap.String("check_out", checkOut),
			zap.Error(err),
		)
		return nil, 0, false, errs.NewBadRequestError("check out format not valid.")
	}

	if !parsedCheckOut.After(parsedCheckIn) {
		logger.Warn("invalid date range: check-out must be after check-in",
			zap.Time("check_in", parsedCheckIn),
			zap.Time("check_out", parsedCheckOut),
		)
		return nil, 0, false, errs.NewBadRequestError("check out must be after check in")
	}

	nights := uint8(parsedCheckOut.Sub(parsedCheckIn).Hours() / 24)
	if nights <= 0 {
		logger.Warn("invalid stay duration calculated",
			zap.Uint8("nights", nights),
		)
		return nil, 0, false, fmt.Errorf("invalid stay duration")
	}

	propertyType := ""
	var minRating float32 = 0

	propertyIDs, err := s.searchRepo.SearchRawIDs(
		ctx, destination, propertyType, adults, children, minRating, page, perPage,
	)
	if err != nil {
		logger.Error("failed to query raw property IDs from elasticsearch",
			zap.String("destination", destination),
			zap.Error(err),
		)
		return nil, 0, false, fmt.Errorf("search raw property ids: %w", err)
	}

	if len(propertyIDs) == 0 {
		logger.Info("no property IDs found in elasticsearch",
			zap.String("destination", destination),
		)
		return []SearchProperty{}, 0, false, nil
	}

	availableProperties, err := s.propertyRepo.FilterAvailableProperties(
		ctx,
		propertyIDs,
		parsedCheckIn,
		parsedCheckOut,
		adults,
		children,
		room,
		nights,
		currencyCode,
	)
	if err != nil {
		logger.Error("failed to filter available properties from database",
			zap.Int("input_property_ids_count", len(propertyIDs)),
			zap.Error(err),
		)
		return nil, 0, false, err
	}

	totalCount = len(availableProperties)

	limit := int(perPage)
	hasNext = false

	if len(availableProperties) > limit {
		hasNext = true
		finalProperties = availableProperties[:limit]
	} else {
		finalProperties = availableProperties
	}

	logger.Info("successfully searched properties",
		zap.Int("matched_raw_ids", len(propertyIDs)),
		zap.Int("available_properties", len(finalProperties)),
		zap.Bool("has_next", hasNext),
	)

	return finalProperties, totalCount, hasNext, nil
}

func (s *service) CreateProperty(
	ctx context.Context,
	req *CreateProperty,
) (*Property, error) {
	logger := s.logger.Named("create_property")

	shortId, err := secret.NewAlphaNumericLower(6)
	if err != nil {
		logger.Error("failed to generate shortId secret", zap.Error(err))
		return nil, err
	}

	req.Slug = fmt.Sprintf("%s-%s", slug.Make(req.Name), shortId)

	var property *Property
	err = s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		propertyID, uuidErr := uuid.NewV7()
		if uuidErr != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", uuidErr)
		}

		propertyReq := Property{
			ID:            propertyID,
			Name:          req.Name,
			Slug:          req.Slug,
			Type:          req.Type,
			Timezone:      req.Timezone,
			CheckInFrom:   req.CheckInFrom,
			CheckInUntil:  req.CheckInUntil,
			CheckOutFrom:  req.CheckOutFrom,
			CheckOutUntil: req.CheckOutUntil,
			PartnerID:     req.PartnerID,
		}

		propertyCreated, createErr := s.propertyRepo.Create(txCtx, tx, &propertyReq)
		if createErr != nil {
			logger.Error("failed to insert property in database", zap.Error(createErr))
			return dberr.ValidatePostgresError(createErr)
		}

		property = propertyCreated

		partnerPropertyID, uuidErr := uuid.NewV7()
		if uuidErr != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", uuidErr)
		}

		payloadMap := map[string]any{
			"id":          partnerPropertyID.String(),
			"partner_id":  req.PartnerID.String(),
			"property_id": propertyID,
			"role":        partner.RoleOwner,
		}

		jsonPayload, jsonErr := json.Marshal(payloadMap)
		if jsonErr != nil {
			return fmt.Errorf("failed to marshal outbox payload: %w", jsonErr)
		}

		if outboxErr := s.outboxRepo.Create(
			txCtx,
			tx,
			"partner",
			partnerPropertyID.String(),
			"PartnerPropertyCreated",
			"dev.partner.property.create.v1",
			jsonPayload,
		); outboxErr != nil {
			return outboxErr
		}

		searchPayload := search.IndexPayload{
			ID:        propertyID.String(),
			Name:      req.Name,
			Type:      string(req.Type),
			AvgRating: 0.0,
			Status:    string(StatusDraft),
		}

		searchPayloadBytes, jsonErr := json.Marshal(searchPayload)
		if jsonErr != nil {
			return fmt.Errorf("failed to marshal outbox payload: %w", jsonErr)
		}

		return s.outboxRepo.Create(
			txCtx,
			tx,
			"property",
			propertyID.String(),
			"PropertyCreated",
			"dev.property.inventory.search.v1",
			searchPayloadBytes,
		)
	})
	if err != nil {
		logger.Error("failed to execute transaction for create property",
			zap.Error(err),
		)
		return nil, fmt.Errorf("Service.CreateProperty: %w", err)
	}

	return property, nil
}

func (s *service) CreatePropertyImages(
	ctx context.Context,
	propertyID uuid.UUID,
	images []Image,
) error {
	logger := s.logger.Named("create_property_images")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if err := s.propertyRepo.CreateImages(txCtx, tx, propertyID, images); err != nil {
			logger.Error("failed to insert property images in database", zap.Error(err))
			return dberr.ValidatePostgresError(err)
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for create property images",
			zap.Error(err),
		)
		return fmt.Errorf("Service.CreatePropertyImages: %w", err)
	}

	return nil
}

func (s *service) CreatePropertyRoom(
	ctx context.Context,
	propertyID uuid.UUID,
	req *CreatePropertyRoom,
) error {
	logger := s.logger.Named("create_property_room")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if err := s.propertyRepo.CreateRoom(txCtx, tx, propertyID, req); err != nil {
			logger.Error("failed to insert property room in database", zap.Error(err))
			return dberr.ValidatePostgresError(err)
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for create property room",
			zap.Error(err),
		)
		return fmt.Errorf("Service.CreatePropertyRoom: %w", err)
	}

	return nil
}

func (s *service) CreateRatePlan(
	ctx context.Context,
	id uuid.UUID,
	ratePlan *CreateRatePlan,
) error {
	logger := s.logger.Named("create_rate_plan")

	if err := s.propertyRepo.CreateRatePlan(ctx, id, ratePlan); err != nil {
		logger.Error("failed to insert rate plan in database", zap.Error(err))
		return err
	}

	return nil
}

func (s *service) ReserveProperty(
	ctx context.Context,
	req *ReserveRequest,
) (*ReserveResponse, error) {
	logger := s.logger.Named("reserve_property")

	var result *ReserveResponse
	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		res, err := s.propertyRepo.ReserveProperty(txCtx, tx, req)
		if err != nil {
			logger.Error("failed to reserve property in database", zap.Error(err))
			return err
		}

		result = res
		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for reserve property",
			zap.Error(err),
		)
		return nil, dberr.ValidatePostgresError(err)
	}

	return result, nil
}

func (s *service) GenerateImageUploadURLs(
	ctx context.Context,
	propertyID uuid.UUID,
	files []FileMetadata,
) ([]ImageUpload, error) {
	var UploadURLs []ImageUpload

	for _, file := range files {
		fileId := uuid.New()
		ext := filepath.Ext(file.FileName)

		fileKey := fmt.Sprintf(
			"properties/%s/images/%s%s",
			propertyID.String(),
			fileId.String(),
			ext,
		)

		presignInput := &s3.PutObjectInput{
			Bucket:      aws.String(s.storageCfg.S3.Bucket),
			Key:         aws.String(fileKey),
			ContentType: aws.String(file.ContentType),
			// ContentLength: aws.Int64(int64(file.Size)), // Strictly file size check
		}

		presignedURL, err := s.s3PresignClient.PresignPutObject(
			ctx,
			presignInput,
			s3.WithPresignExpires(15*time.Minute),
		)
		if err != nil {
			return nil, err
		}

		imageURL := fmt.Sprintf("%s/%s", s.storageCfg.CDN.BaseURL, fileKey)

		UploadURLs = append(UploadURLs, ImageUpload{
			ID:        fileId.String(),
			Key:       fileKey,
			UploadURL: presignedURL.URL,
			ImageURL:  imageURL,
		})
	}

	return UploadURLs, nil
}

func (s *service) UpdateLocation(
	ctx context.Context,
	partnerID uuid.UUID,
	propertyID uuid.UUID,
	location *Location,
) error {
	logger := s.logger.Named("update_location")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if err := s.propertyRepo.UpdateLocation(
			txCtx,
			tx,
			partnerID,
			propertyID,
			location,
		); err != nil {
			logger.Error("failed to update property location in database", zap.Error(err))
			return dberr.ValidatePostgresError(err)
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for update location",
			zap.Error(err),
		)
		return fmt.Errorf("Service.UpdateLocation: %w", err)
	}

	return nil
}

func (s *service) UpdateDescription(
	ctx context.Context,
	partnerID uuid.UUID,
	propertyID uuid.UUID,
	description *Description,
) error {
	logger := s.logger.Named("update_description")

	if err := s.propertyRepo.UpdateDescription(
		ctx,
		partnerID,
		propertyID,
		description,
	); err != nil {
		logger.Error("failed to update property description in database", zap.Error(err))
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdatePolicies(
	ctx context.Context,
	partnerID uuid.UUID,
	propertyID uuid.UUID,
	policy *Policies,
) error {
	logger := s.logger.Named("update_policies")

	if err := s.propertyRepo.UpdatePolicies(
		ctx,
		partnerID,
		propertyID,
		policy,
	); err != nil {
		logger.Error("failed to update property policies in database", zap.Error(err))
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) PublishProperty(
	ctx context.Context,
	partnerID, propertyID uuid.UUID,
) error {
	logger := s.logger.Named("publish_property")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if err := s.propertyRepo.Publish(txCtx, tx, partnerID, propertyID); err != nil {
			logger.Error("failed to update property status to publish in database", zap.Error(err))
			return err
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for publish property",
			zap.Error(err),
		)
		return err
	}

	return nil
}

func (s *service) UnpublishProperty(
	ctx context.Context,
	partnerID, propertyID uuid.UUID,
) error {
	logger := s.logger.Named("unpublish_property")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if err := s.propertyRepo.Unpublish(txCtx, tx, partnerID, propertyID); err != nil {
			logger.Error(
				"failed to update property status to unpublish in database",
				zap.Error(err),
			)
			return dberr.ValidatePostgresError(err)
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for publish property",
			zap.Error(err),
		)
		return fmt.Errorf("Service.PublishProperty: %w", err)
	}

	return nil
}
