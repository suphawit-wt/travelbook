// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/review-service/internal/outbox"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the data access contract for review-related operations.
type Service interface {
	GetReviewsByPropertyID(ctx context.Context, propertyID uuid.UUID) ([]Review, error)
	CreateReview(ctx context.Context, review *Review) (*Review, error)
}

type service struct {
	logger     *zaplog.Logger
	txMgr      database.TxManager
	reviewRepo Repository
	outboxRepo outbox.Repository
}

// NewService creates a new instance of Service with the provided review repository.
func NewService(
	logger *zaplog.Logger,
	txMgr database.TxManager,
	reviewRepo Repository,
	outboxRepo outbox.Repository,
) Service {
	return &service{
		logger:     logger,
		txMgr:      txMgr,
		reviewRepo: reviewRepo,
		outboxRepo: outboxRepo,
	}
}

func (s *service) GetReviewsByPropertyID(
	ctx context.Context,
	propertyID uuid.UUID,
) ([]Review, error) {
	logger := s.logger.Named("get_reviews_by_property_id")

	reviews, err := s.reviewRepo.GetReviewsByPropertyID(ctx, propertyID, 5)
	if err != nil {
		logger.Error("failed to query reviews by property id",
			zap.String("propertyId", propertyID.String()),
			zap.Error(err),
		)
		return nil, err
	}

	return reviews, nil
}

func (s *service) CreateReview(
	ctx context.Context,
	review *Review,
) (*Review, error) {
	logger := s.logger.Named("create_review")

	var err error
	if review.ID == uuid.Nil {
		review.ID, err = uuid.NewV7()
		if err != nil {
			logger.Error("failed to generate review ID",
				zap.Error(err),
			)
			return nil, fmt.Errorf("review_service.createReview: %w", err)
		}
	}

	now := time.Now().UTC()
	review.CreatedAt = now
	review.UpdatedAt = now

	var result *Review
	err = s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		c, createErr := s.reviewRepo.Create(
			txCtx,
			tx,
			review,
		)
		if createErr != nil {
			return createErr
		}
		result = c

		var cassandraModel Cassandra
		casModel := cassandraModel.FromDomain(review)

		jsonPayload, jsonErr := json.Marshal(casModel)
		if jsonErr != nil {
			return fmt.Errorf("failed to marshal outbox payload: %w", jsonErr)
		}

		if outboxErr := s.outboxRepo.Create(
			txCtx,
			tx,
			"review",
			review.ID.String(),
			"ReviewCreated",
			"dev.review.booking.create.v1",
			jsonPayload,
		); outboxErr != nil {
			return outboxErr
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to create new review in transaction",
			zap.String("bookingId", review.BookingID.String()),
			zap.Error(err),
		)
		return nil, fmt.Errorf("review_service.createReview: %w", err)
	}

	return result, nil
}
