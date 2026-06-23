// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the interface for user-related operations.
type Service interface {
	CreateUser(ctx context.Context, user *User) error
	CreateUserFromOAuth(ctx context.Context, user *User) error
}

type service struct {
	logger   *zaplog.Logger
	userRepo Repository
}

// NewService creates a new instance of User Service with the provided Elasticsearch client.
func NewService(logger *zaplog.Logger, userRepo Repository) Service {
	return &service{logger: logger, userRepo: userRepo}
}

func (s *service) CreateUser(
	ctx context.Context,
	user *User,
) error {
	logger := s.logger.Named("create_user")

	_, err := s.userRepo.Create(ctx, user)
	if err != nil {
		logger.Error("Failed to create user", zap.Error(err))
		return err
	}

	return nil
}

func (s *service) CreateUserFromOAuth(
	ctx context.Context,
	user *User,
) error {
	logger := s.logger.Named("create_user_from_oauth")

	_, err := s.userRepo.CreateFromOAuth(ctx, user)
	if err != nil {
		logger.Error("Failed to create user from OAuth", zap.Error(err))
		return err
	}

	return nil
}
