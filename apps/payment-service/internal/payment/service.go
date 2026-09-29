// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package payment

import (
	"context"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v86"
	"github.com/stripe/stripe-go/v86/paymentintent"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/bookingclient"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
)

// Service defines the business logic for booking entities.
type Service interface {
	CreatePaymentIntent(ctx context.Context, bookingID uuid.UUID) (string, error)
}

type service struct {
	logger        *zaplog.Logger
	paymentCfg    *config.PaymentConfig
	bookingClient bookingclient.Client
}

// NewService creates a new instance of Service with the provided repository.
func NewService(
	logger *zaplog.Logger,
	paymentCfg *config.PaymentConfig,
	bookingClient bookingclient.Client,
) Service {
	return &service{
		logger:        logger.Named("payment_service"),
		paymentCfg:    paymentCfg,
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
