// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// NavbarInfo return navbar info of user
type NavbarInfo struct {
	AvatarURL  *string
	GeniusTier uint8
}

// Service defines the data access contract for user-related operations.
type Service interface {
	GetNavbarInfo(ctx context.Context, id uuid.UUID) (*NavbarInfo, error)
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
