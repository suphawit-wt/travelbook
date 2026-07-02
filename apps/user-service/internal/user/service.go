// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/s3/transfermanager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/imageutil"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
)

// NavbarInfo return navbar info of user
type NavbarInfo struct {
	AvatarURL  *string
	GeniusTier uint8
}

// Service defines the data access contract for user-related operations.
type Service interface {
	GetUserById(ctx context.Context, id uuid.UUID) (*User, error)
	GetNavbarInfo(ctx context.Context, id uuid.UUID) (*NavbarInfo, error)
	UploadAvatar(
		ctx context.Context,
		userID uuid.UUID,
		fileHeader *multipart.FileHeader,
	) (string, error)
	UpdateName(ctx context.Context, id uuid.UUID, firstName, lastName string) error
	UpdateDisplayName(ctx context.Context, id uuid.UUID, displayName string) error
	UpdatePhoneNumber(ctx context.Context, id uuid.UUID, phoneNumber string) error
	UpdateDateOfBirth(ctx context.Context, id uuid.UUID, dateOfBirth time.Time) error
	UpdateNationality(ctx context.Context, id uuid.UUID, nationality string) error
	UpdateGender(ctx context.Context, id uuid.UUID, gender string) error
}

type service struct {
	logger     *zaplog.Logger
	storageCfg *config.StorageConfig
	s3Client   *s3.Client
	userRepo   Repository
}

// NewService creates a new instance of Service with the provided user repository.
func NewService(
	logger *zaplog.Logger,
	storageCfg *config.StorageConfig,
	s3Client *s3.Client,
	userRepo Repository,
) Service {
	return &service{
		logger:     logger,
		storageCfg: storageCfg,
		s3Client:   s3Client,
		userRepo:   userRepo,
	}
}

func (s *service) GetUserById(ctx context.Context, id uuid.UUID) (*User, error) {
	logger := s.logger.Named("get_user_by_id")

	user, found, err := s.userRepo.GetById(ctx, id)
	if err != nil {
		logger.Error("failed to query user by id",
			zap.String("id", id.String()),
			zap.Error(err),
		)
		return nil, err
	}

	if !found {
		return nil, errs.NewNotFoundError("User not found.")
	}

	return user, nil
}

func (s *service) GetNavbarInfo(ctx context.Context, id uuid.UUID) (*NavbarInfo, error) {
	logger := s.logger.Named("get_navbar_info")

	user, found, err := s.userRepo.GetById(ctx, id)
	if err != nil {
		logger.Error("failed to query navbar info by id",
			zap.String("id", id.String()),
			zap.Error(err),
		)
		return nil, err
	}

	if !found {
		return nil, errs.NewNotFoundError("User not found.")
	}

	return &NavbarInfo{AvatarURL: user.AvatarURL, GeniusTier: user.GeniusTier}, nil
}

func (s *service) UploadAvatar(
	ctx context.Context,
	userID uuid.UUID,
	fileHeader *multipart.FileHeader,
) (string, error) {
	logger := s.logger.Named("upload_avatar")

	if fileHeader.Size > 2<<20 {
		return "", errs.NewRequestEntityTooLargeError("max file size is 2MB")
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	allowed := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".webp": true,
	}
	if !allowed[ext] {
		return "", errs.NewUnsupportedMediaTypeError("invalid file type")
	}

	user, found, err := s.userRepo.GetById(ctx, userID)
	if err != nil {
		logger.Error("failed to query user by id",
			zap.String("id", userID.String()),
			zap.Error(err),
		)
		return "", err
	}

	if !found {
		return "", errs.NewNotFoundError("User not found.")
	}

	avatarImage, err := imageutil.ProcessAvatarImage(fileHeader, 512)
	if err != nil {
		logger.Error("failed to process avatar image",
			zap.Error(err),
		)
		return "", errs.NewBadRequestError("Failed to process avatar image")
	}

	avatarKey := fmt.Sprintf("users/%s/avatar/%s.png", userID, uuid.New().String())

	uploader := transfermanager.New(s.s3Client)

	_, err = uploader.UploadObject(ctx, &transfermanager.UploadObjectInput{
		Bucket:       &s.storageCfg.S3.Bucket,
		Key:          &avatarKey,
		Body:         avatarImage,
		ContentType:  aws.String("image/png"),
		CacheControl: aws.String("public, max-age=86400, s-maxage=86400"),
	})
	if err != nil {
		logger.Error("failed to upload avatar image to s3",
			zap.String("avatar_key", avatarKey),
			zap.Error(err),
		)
		return "", errs.NewUnexpectedError()
	}

	// TODO: Kafka Delete Old avatar
	if user.AvatarKey != nil {
		_, err := s.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
			Bucket: aws.String(s.storageCfg.S3.Bucket),
			Key:    aws.String(*user.AvatarKey),
		})
		if err != nil {
			logger.Error("failed to delete old avatar image from s3",
				zap.String("avatar_key", *user.AvatarKey),
				zap.Error(err),
			)
		}
	}

	avatarURL := fmt.Sprintf("%s/%s", s.storageCfg.CDN.BaseURL, avatarKey)

	if err := s.userRepo.UpdateAvatar(ctx, userID, avatarKey, avatarURL); err != nil {
		if err == pgx.ErrNoRows {
			return "", errs.NewNotFoundError("User not found.")
		}

		logger.Error("failed to update avatar image in database",
			zap.String("user_id", userID.String()),
			zap.String("avatar_key", avatarKey),
			zap.String("avatar_url", avatarURL),
			zap.Error(err),
		)

		// TODO: Delete Image Uploaded by Kafka
		_, err := s.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
			Bucket: aws.String(s.storageCfg.S3.Bucket),
			Key:    aws.String(avatarKey),
		})
		if err != nil {
			logger.Error("failed to delete uploaded avatar image from s3",
				zap.String("user_id", userID.String()),
				zap.String("avatar_key", avatarKey),
				zap.String("avatar_url", avatarURL),
				zap.Error(err),
			)
		}

		return "", dberr.ValidatePostgresError(err)
	}

	return avatarURL, nil
}

func (s *service) UpdateName(
	ctx context.Context,
	id uuid.UUID,
	firstName, lastName string,
) error {
	logger := s.logger.Named("update_name")

	if err := s.userRepo.UpdateName(ctx, id, firstName, lastName); err != nil {
		logger.Error("failed to update name in database",
			zap.String("user_id", id.String()),
			zap.String("first_name", firstName),
			zap.String("last_name", lastName),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdateDisplayName(
	ctx context.Context,
	id uuid.UUID,
	displayName string,
) error {
	logger := s.logger.Named("update_display_name")

	if err := s.userRepo.UpdateDisplayName(ctx, id, displayName); err != nil {
		logger.Error("failed to update display name in database",
			zap.String("user_id", id.String()),
			zap.String("display_name", displayName),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdatePhoneNumber(
	ctx context.Context,
	id uuid.UUID,
	phoneNumber string,
) error {
	logger := s.logger.Named("update_phone_number")

	if err := s.userRepo.UpdatePhoneNumber(ctx, id, phoneNumber); err != nil {
		logger.Error("failed to update phone number in database",
			zap.String("user_id", id.String()),
			zap.String("phone_number", phoneNumber),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdateDateOfBirth(
	ctx context.Context,
	id uuid.UUID,
	dateOfBirth time.Time,
) error {
	logger := s.logger.Named("update_date_of_birth")

	if err := s.userRepo.UpdateDateOfBirth(ctx, id, dateOfBirth); err != nil {
		logger.Error("failed to update date of birth in database",
			zap.String("user_id", id.String()),
			zap.String("date_of_birth", dateOfBirth.String()),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdateNationality(
	ctx context.Context,
	id uuid.UUID,
	nationality string,
) error {
	logger := s.logger.Named("update_nationality")

	if err := s.userRepo.UpdateNationality(ctx, id, nationality); err != nil {
		logger.Error("failed to update nationality in database",
			zap.String("user_id", id.String()),
			zap.String("nationality", nationality),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) UpdateGender(ctx context.Context, id uuid.UUID, gender string) error {
	logger := s.logger.Named("update_gender")

	if err := s.userRepo.UpdateGender(ctx, id, gender); err != nil {
		logger.Error("failed to update nationality in database",
			zap.String("user_id", id.String()),
			zap.String("gender", gender),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}
