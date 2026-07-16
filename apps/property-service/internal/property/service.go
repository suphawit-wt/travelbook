// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

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
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/secret"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
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

// Service defines the business logic contract for property-related operations.
type Service interface {
	CreateProperty(ctx context.Context, req *CreateProperty) (*Property, error)
}

type service struct {
	logger          *zaplog.Logger
	storageCfg      *config.StorageConfig
	s3PresignClient *s3.PresignClient
	propertyRepo    Repository
	outboxRepo      outbox.Repository
	txMgr           database.TxManager
}

// NewService creates a new instance of Service with the provided dependencies.
func NewService(
	logger *zaplog.Logger,
	storageCfg *config.StorageConfig,
	s3PresignClient *s3.PresignClient,
	propertyRepo Repository,
	outboxRepo outbox.Repository,
	txMgr database.TxManager,
) Service {
	return &service{
		logger:          logger,
		storageCfg:      storageCfg,
		s3PresignClient: s3PresignClient,
		propertyRepo:    propertyRepo,
		outboxRepo:      outboxRepo,
		txMgr:           txMgr,
	}
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
		propertyID, err := uuid.NewV7()
		if err != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", err)
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
			"id":          partnerPropertyID,
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
