// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package partner

import (
	"context"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the data access contract for partner-related operations.
type Service interface {
	CreatePartner(ctx context.Context, partner *Partner) error
}

type service struct {
	logger      *zaplog.Logger
	partnerRepo Repository
}

// NewService creates a new instance of Service with the provided Elasticsearch client.
func NewService(
	logger *zaplog.Logger,
	partnerRepo Repository,
) Service {
	return &service{logger: logger, partnerRepo: partnerRepo}
}

func (s *service) CreatePartner(
	ctx context.Context,
	partner *Partner,
) error {
	logger := s.logger.Named("create_partner")

	_, err := s.partnerRepo.Create(ctx, partner)
	if err != nil {
		logger.Error("Failed to create partner", zap.Error(err))
		return err
	}

	return nil
}
