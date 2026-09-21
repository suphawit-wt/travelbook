// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
)

// Service defines the business logic for booking entities.
type Service interface {
	RestoreRoomInventory(ctx context.Context, bookingID uuid.UUID) error
}

type service struct {
	logger         *zaplog.Logger
	txMgr          database.TxManager
	bookingRepo    Repository
	propertyClient propertyclient.Client
}

// NewService creates a new instance of Service with the provided repository.
func NewService(
	logger *zaplog.Logger,
	txMgr database.TxManager,
	bookingRepo Repository,
	propertyClient propertyclient.Client,
) Service {
	return &service{
		logger:         logger,
		txMgr:          txMgr,
		bookingRepo:    bookingRepo,
		propertyClient: propertyClient,
	}
}

func (s *service) RestoreRoomInventory(
	ctx context.Context,
	bookingID uuid.UUID,
) error {
	logger := s.logger.Named("restore_room_inventory")

	err := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		bookingRestore, err := s.bookingRepo.RestoreRoomInventory(txCtx, tx, bookingID)
		if err != nil {
			logger.Error(
				"Failed to restore room inventory",
				zap.String("bookingID", bookingID.String()),
				zap.Error(err),
			)
			return err
		}

		if bookingRestore == nil {
			logger.Info(
				"Skipping inventory restoration: booking is already processed or not pending",
				zap.String("bookingID", bookingID.String()),
			)
			return nil
		}

		if err := s.propertyClient.Release(
			txCtx,
			bookingRestore.ToBookingReleaseDTO(),
		); err != nil {
			logger.Error(
				"Failed to restore room inventory",
				zap.String("propertyID", bookingRestore.PropertyID.String()),
				zap.Error(err),
			)
			return err
		}

		return nil
	})
	if err != nil {
		logger.Error("failed to execute transaction for user creation",
			zap.String("bookingID", bookingID.String()),
			zap.Error(err),
		)
		return dberr.ValidatePostgresError(err)
	}

	return nil
}
