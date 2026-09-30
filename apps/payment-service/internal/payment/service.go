// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package payment

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v86"
	"github.com/stripe/stripe-go/v86/paymentintent"
	"github.com/stripe/stripe-go/v86/webhook"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/bookingclient"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
)

// Service defines the business logic for booking entities.
type Service interface {
	CreatePaymentIntent(ctx context.Context, bookingID uuid.UUID) (string, error)
	StripeWebhook(ctx context.Context, payload []byte, signature string) error
}

type service struct {
	logger        *zaplog.Logger
	paymentCfg    *config.PaymentConfig
	paymentRepo   Repository
	bookingClient bookingclient.Client
}

// NewService creates a new instance of Service with the provided repository.
func NewService(
	logger *zaplog.Logger,
	paymentCfg *config.PaymentConfig,
	paymentRepo Repository,
	bookingClient bookingclient.Client,
) Service {
	return &service{
		logger:        logger.Named("payment_service"),
		paymentCfg:    paymentCfg,
		paymentRepo:   paymentRepo,
		bookingClient: bookingClient,
	}
}

func (s *service) CreatePaymentIntent(
	ctx context.Context,
	bookingID uuid.UUID,
) (string, error) {
	logger := s.logger.With(
		zap.String("method", "CreatePaymentIntent"),
		zap.String("booking_id", bookingID.String()),
	)

	totalPriceCents, err := s.bookingClient.GetTotalPriceCents(ctx, bookingID)
	if err != nil {
		logger.Error("failed to retrieve booking total price", zap.Error(err))
		return "", dberr.ValidatePostgresError(err)
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(totalPriceCents),
		Currency: stripe.String(string(stripe.CurrencyUSD)),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	params.AddMetadata("booking_id", bookingID.String())

	result, err := paymentintent.New(params)
	if err != nil {
		logger.Error("failed to create stripe payment intent",
			zap.Int64("amount_cents", totalPriceCents),
			zap.Error(err),
		)
		return "", err
	}

	logger.Info("stripe payment intent created successfully",
		zap.String("payment_intent_id", result.ID),
		zap.Int64("amount_cents", totalPriceCents),
	)

	return result.ClientSecret, nil
}

func (s *service) StripeWebhook(
	ctx context.Context,
	payload []byte,
	signature string,
) error {
	logger := s.logger.With(zap.String("method", "StripeWebhook"))

	event, err := webhook.ConstructEventWithOptions(
		payload,
		signature,
		s.paymentCfg.Stripe.WebhookSecret,
		webhook.ConstructEventOptions{
			IgnoreAPIVersionMismatch: true,
		},
	)
	if err != nil {
		logger.Warn("invalid stripe webhook signature or payload", zap.Error(err))
		return errs.NewBadRequestError("signature error")
	}

	logger = logger.With(
		zap.String("event_id", event.ID),
		zap.String("event_type", string(event.Type)),
	)

	//exhaustive:ignore
	switch event.Type {
	case stripe.EventTypePaymentIntentSucceeded:
		var pi stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &pi)
		if err != nil {
			logger.Error("failed to unmarshal payment_intent.succeeded payload", zap.Error(err))
			return errs.NewBadRequestError("invalid event data")
		}

		bID := pi.Metadata["booking_id"]
		bookingID, err := uuid.Parse(bID)
		if err != nil {
			logger.Error("invalid or missing booking_id in payment intent metadata",
				zap.String("raw_booking_id", bID),
				zap.String("payment_intent_id", pi.ID),
				zap.Error(err),
			)
			return errs.NewBadRequestError("Invalid Booking ID type")
		}

		evtLogger := logger.With(
			zap.String("booking_id", bookingID.String()),
			zap.String("payment_intent_id", pi.ID),
		)

		if err := s.bookingClient.ConfirmBooking(ctx, bookingID); err != nil {
			evtLogger.Error("failed to confirm booking after payment", zap.Error(err))
			return errs.NewUnexpectedError()
		}

		if err := s.paymentRepo.MarkAsPaid(
			ctx,
			bookingID,
			pi.ID,
			pi.Amount,
			string(pi.Currency),
			pi.PaymentMethod.ID,
		); err != nil {
			evtLogger.Error("failed to mark payment as paid in database", zap.Error(err))
			return errs.NewUnexpectedError()
		}

		evtLogger.Info("payment successfully processed and booking confirmed")

	case stripe.EventTypePaymentIntentPaymentFailed:
		var pi stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &pi); err == nil {
			logger.Warn("stripe payment intent failed",
				zap.String("payment_intent_id", pi.ID),
				zap.String("booking_id", pi.Metadata["booking_id"]),
			)
		} else {
			logger.Warn("stripe payment intent failed")
		}

	default:
		logger.Debug("unhandled stripe webhook event received")
	}

	return nil
}
