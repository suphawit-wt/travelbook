// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/secret"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/events"
)

func (s *service) generateAndSaveOTP(
	ctx context.Context,
	email string,
	logger *zaplog.Logger,
) (string, error) {
	otp, err := secret.NewAlphaNumericUpper(6)
	if err != nil {
		logger.Error("failed to generate OTP secret", zap.Error(err))
		return "", err
	}

	otpKey := "otp:user:email:" + email
	if err := s.sessionRepo.SaveOTP(ctx, otpKey, otp, 10*time.Minute); err != nil {
		logger.Error("failed to save OTP to redis", zap.String("email", email), zap.Error(err))
		return "", err
	}

	return otp, nil
}

func (s *service) determineOTPEventType(
	ctx context.Context,
	email string,
	logger *zaplog.Logger,
) (string, error) {
	_, err := s.authRepo.GetAccountByEmail(ctx, email)
	if err == nil {
		return "auth.user.sign-in.otp-generated", nil
	}

	if errors.Is(err, ErrAccountNotFound) {
		return "auth.user.sign-up.otp-generated", nil
	}

	logger.Error("failed to query auth credentials by email",
		zap.String("email", email),
		zap.Error(err),
	)
	return "", fmt.Errorf("auth_service.UserSignIn: %w", err)
}

func (s *service) buildOTPEventPayload(email, otp, eventType string) ([]byte, error) {
	envelope := events.EventPayload[OTPPayload]{
		Metadata: events.Metadata{
			EventID:       "evt_" + uuid.New().String(),
			CorrelationID: "corr_" + uuid.New().String(),
			EventType:     eventType,
			CreatedAt:     time.Now().UTC(),
		},
		Data: OTPPayload{
			Email: email,
			OTP:   otp,
		},
	}

	return json.Marshal(envelope)
}

func (s *service) publishOTPEventWithRollback(
	ctx context.Context,
	email string,
	payloadBytes []byte,
	logger *zaplog.Logger,
) error {
	topic := "dev.email.auth.notifications.v1"
	if err := s.kafkaProducer.Publish(ctx, topic, []byte(email), payloadBytes); err != nil {
		logger.Error("failed to enqueue OTP event to Kafka",
			zap.String("topic", topic),
			zap.String("email", email),
			zap.Error(err),
		)

		otpKey := "otp:user:email:" + email
		if _, delErr := s.sessionRepo.DeleteOTP(ctx, otpKey); delErr != nil {
			logger.Error("failed to delete OTP from redis after kafka failure",
				zap.String("otp_key", otpKey),
				zap.Error(delErr),
			)
		}

		return err
	}

	return nil
}
