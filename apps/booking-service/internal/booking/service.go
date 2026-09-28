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
	"github.com/shopspring/decimal"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
	"github.com/suphawit-wt/travelbook/pkg/shared/events"
)

// PropertyInfo represents the details of a property associated with a booking.
type PropertyInfo struct {
	Name        string
	Type        string
	AvgRating   float64
	ReviewCount uint32
	CountryCode string
	City        string
	Area        string
	ZipCode     string
}

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
	GetBookingByID(
		ctx context.Context,
		id uuid.UUID,
		currencyCode string,
	) (*PropertyInfo, *Info, error)
	GetTotalPriceCents(ctx context.Context, bookingID uuid.UUID) (int64, error)
	CreateBooking(
		ctx context.Context,
		req *CreateBooking,
	) (*Response, error)
	UpdateBookingDetails(ctx context.Context, req *UpdateBooking) error
	ConfirmBooking(ctx context.Context, bookingID uuid.UUID) error
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

func (s *service) GetBookingByID(
	ctx context.Context,
	id uuid.UUID,
	currencyCode string,
) (*PropertyInfo, *Info, error) {
	logger := s.logger.Named("get_booking_by_id").With(
		zap.Stringer("booking_id", id),
		zap.String("currency_code", currencyCode),
	)

	booking, found, err := s.bookingRepo.GetByID(ctx, id, currencyCode)
	if err != nil {
		logger.Error("failed to fetch booking from repository", zap.Error(err))
		return nil, nil, err
	}

	if !found {
		logger.Warn("booking not found in repository")
		return nil, nil, errs.NewNotFoundError("Booking not found.")
	}

	logger = logger.With(zap.String("property_id", booking.PropertyID.String()))

	property, err := s.propertyClient.GetPropertyByID(ctx, booking.PropertyID)
	if err != nil {
		logger.Error("failed to fetch property details", zap.Error(err))
		return nil, nil, err
	}

	if !found {
		return nil, nil, errs.NewNotFoundError("Booking not found.")
	}

	exchangeResponse, err := s.propertyClient.GetExchangeRate(ctx, currencyCode)
	if err != nil {
		logger.Error("failed to fetch exchange rate", zap.Error(err))
		return nil, nil, err
	}

	rateDec := decimal.NewFromFloat(exchangeResponse.ExchangeRate)
	totalUSD := decimal.NewFromFloat(booking.TotalPrice)

	totalLocal := totalUSD.
		Mul(rateDec).
		Round(int32(exchangeResponse.Precision))

	tax := totalLocal.
		Mul(decimal.NewFromFloat(0.07)).
		Round(int32(exchangeResponse.Precision))

	booking.TotalPrice, _ = totalLocal.Float64()
	booking.TaxesAndFees, _ = tax.Float64()

	propertyInfo := PropertyInfo{
		Name:        property.Name,
		Type:        string(property.Type),
		AvgRating:   property.AvgRating,
		ReviewCount: property.ReviewCount,
		CountryCode: property.CountryCode,
		City:        property.City,
		Area:        property.Area,
		ZipCode:     property.ZipCode,
	}

	logger.Debug("successfully retrieved booking and property info")
	return &propertyInfo, booking, nil
}

func (s *service) GetTotalPriceCents(
	ctx context.Context,
	bookingID uuid.UUID,
) (int64, error) {
	logger := s.logger.Named("get_total_price_cents").With(
		zap.Stringer("booking_id", bookingID),
	)

	totalPriceCents, err := s.bookingRepo.GetTotalPriceCents(ctx, bookingID)
	if err != nil {
		logger.Error("failed to fetch total price cents from repository", zap.Error(err))
		return 0, err
	}

	return totalPriceCents, nil
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

func (s *service) UpdateBookingDetails(
	ctx context.Context,
	req *UpdateBooking,
) error {
	logger := s.logger.Named("update_booking_details").With(
		zap.String("bookingId", req.BookingID.String()),
	)

	if err := s.bookingRepo.UpdateDetails(ctx, req); err != nil {
		logger.Error("failed to update booking details in repository", zap.Error(err))
		return dberr.ValidatePostgresError(err)
	}

	return nil
}

func (s *service) ConfirmBooking(
	ctx context.Context,
	bookingID uuid.UUID,
) error {
	logger := s.logger.Named("confirm_booking").With(
		zap.Stringer("booking_id", bookingID),
	)

	if err := s.bookingRepo.ConfirmBooking(ctx, bookingID); err != nil {
		logger.Error("failed to confirm booking in repository", zap.Error(err))
		return dberr.ValidatePostgresError(err)
	}

	return nil
}
