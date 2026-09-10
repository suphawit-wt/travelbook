// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
	"github.com/suphawit-wt/travelbook/pkg/shared/events"
)

// Response represents a response of booking.
type Response struct {
	BookingID string
	ExpiresAt time.Time
}

// TimeoutExpiredData represents the payload data for an expired booking timeout event.
type TimeoutExpiredData struct {
	BookingID string `json:"bookingId"`
}

// Service defines the business logic for booking entities.
type Service interface {
	CreateBooking(
		ctx context.Context,
		req *CreateBooking,
	) (*Response, error)
}

type service struct {
	logger         *zaplog.Logger
	bookingRepo    Repository
	txMgr          database.TxManager
	kafkaProducer  messaging.KafkaProducer
	propertyClient propertyclient.Client
}

// NewService creates a new instance of Service with the provided repository.
func NewService(
	logger *zaplog.Logger,
	bookingRepo Repository,
	txMgr database.TxManager,
	kafkaProducer messaging.KafkaProducer,
	propertyClient propertyclient.Client,
) Service {
	return &service{
		logger:         logger,
		bookingRepo:    bookingRepo,
		txMgr:          txMgr,
		kafkaProducer:  kafkaProducer,
		propertyClient: propertyClient,
	}
}

func (s *service) CreateBooking(
	ctx context.Context,
	req *CreateBooking,
) (*Response, error) {
	logger := s.logger.Named("create_booking").With(
		zap.String("currency_code", req.CurrencyCode),
		zap.String("propertyId", req.PropertyID.String()),
	)

	reserveReq := req.ToReserveRequest()

	hold, err := s.propertyClient.Reserve(ctx, reserveReq)
	if err != nil {
		logger.Error("failed to reserve inventory in property service", zap.Error(err))
		return nil, fmt.Errorf("inventory reservation failed: %w", err)
	}

	var inventoryHold InventoryHold
	holdReq := inventoryHold.FromDTO(hold)
	bookingID := hold.ReservationID

	txErr := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		if createErr := s.bookingRepo.Create(txCtx, tx, bookingID, req, holdReq); createErr != nil {
			logger.Error("failed to create booking in repository", zap.Error(createErr))
			return createErr
		}

		return nil
	})
	if txErr != nil {
		eventID := "evt_" + uuid.New().String()
		correlationID := "corr_" + uuid.New().String()
		topic := "dev.booking.timeout.expired.v1"

		envelope := events.EventPayload[TimeoutExpiredData]{
			Metadata: events.Metadata{
				EventID:       eventID,
				CorrelationID: correlationID,
				EventType:     "BookingTimeoutExpired",
				CreatedAt:     time.Now().UTC(),
			},
			Data: TimeoutExpiredData{
				BookingID: bookingID.String(),
			},
		}

		payloadBytes, err := json.Marshal(envelope)
		if err != nil {
			logger.Error("failed to marshal event payload", zap.Error(err))
			return nil, fmt.Errorf("marshal timeout expired payload: %w", err)
		}

		if err := s.kafkaProducer.Publish(
			ctx,
			topic,
			[]byte(bookingID.String()),
			payloadBytes,
		); err != nil {
			logger.Error("failed to publish booking timeout event to Kafka", zap.Error(err))
			return nil, fmt.Errorf("publish message to kafka topic %s: %w", topic, err)
		}

		logger.Error("failed to create new booking in transaction",
			zap.String("reservationId", bookingID.String()),
			zap.Error(txErr),
		)
		return nil, dberr.ValidatePostgresError(txErr)
	}

	return &Response{
		BookingID: bookingID.String(),
		ExpiresAt: hold.ExpiresAt,
	}, nil
}
