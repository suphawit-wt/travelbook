// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the interface for review-related operations.
type Service interface {
	CreateReview(ctx context.Context, review *Review) error
}

type service struct {
	logger     *zaplog.Logger
	reviewRepo Repository
}

// NewService creates a new instance of Service with the provided Elasticsearch client.
func NewService(
	logger *zaplog.Logger,
	reviewRepo Repository,
) Service {
	return &service{logger: logger, reviewRepo: reviewRepo}
}

func (s *service) CreateReview(
	ctx context.Context,
	review *Review,
) error {
	logger := s.logger.Named("create_review")

	if err := s.reviewRepo.Create(ctx, review); err != nil {
		logger.Error("Failed to create user", zap.Error(err))
		return err
	}

	return nil
}
