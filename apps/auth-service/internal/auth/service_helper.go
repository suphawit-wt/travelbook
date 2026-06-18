// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"crypto/rsa"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/session"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/secret"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/dberr"
	"github.com/suphawit-wt/travelbook/pkg/shared/events"
)

// KeyPair holds the private signing keys for a client type.
type KeyPair struct {
	AccessPrivateKey  *rsa.PrivateKey
	RefreshPrivateKey *rsa.PrivateKey
}

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

func (s *service) verifyOTP(ctx context.Context, email, otp string, logger *zaplog.Logger) error {
	otpKey := "otp:user:email:" + email

	verified, err := s.sessionRepo.VerifyOTP(ctx, otpKey, otp)
	if err != nil {
		if errors.Is(err, session.ErrTokenNotFound) {
			logger.Warn(
				"OTP verification failed: token expired or not found",
				zap.String("email", email),
			)
			return errs.NewUnauthorizedError("OTP is invalid or has expired.")
		}

		logger.Error(
			"failed to retrieve OTP from repository",
			zap.String("email", email),
			zap.Error(err),
		)
		return fmt.Errorf("authService.verifyOTP: %w", err)
	}

	if !verified {
		logger.Warn("OTP verification failed: code mismatch", zap.String("email", email))
		return errs.NewUnauthorizedError("Invalid OTP provided.")
	}

	return nil
}

func (s *service) getOrCreateUserAccount(
	ctx context.Context,
	email string,
	logger *zaplog.Logger,
) (*Account, error) {
	acc, err := s.authRepo.GetAccountByEmail(ctx, email)
	if err == nil {
		return acc, nil
	}

	if !errors.Is(err, ErrAccountNotFound) {
		return nil, err
	}

	var newAcc *Account
	txErr := s.txMgr.ExecInTx(ctx, func(txCtx context.Context, tx pgx.Tx) error {
		accID, err := uuid.NewV7()
		if err != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", err)
		}

		createdAcc, createErr := s.authRepo.CreateAccount(
			txCtx,
			tx,
			&Account{
				ID:            accID,
				Email:         email,
				EmailVerified: true,
				Roles:         []string{RoleCustomer.String()},
			},
		)
		if createErr != nil {
			return dberr.ValidatePostgresError(createErr)
		}
		newAcc = createdAcc

		payloadMap := map[string]any{
			"id":    newAcc.ID.String(),
			"email": newAcc.Email,
		}

		jsonPayload, jsonErr := json.Marshal(payloadMap)
		if jsonErr != nil {
			return fmt.Errorf("failed to marshal outbox payload: %w", jsonErr)
		}

		return s.outboxRepo.Create(
			txCtx,
			tx,
			"user",
			newAcc.ID.String(),
			"UserProfileCreated",
			"dev.user.profile.create.v1",
			jsonPayload,
		)
	})

	if txErr != nil {
		logger.Error("failed to create new user credential in transaction",
			zap.String("email", email),
			zap.Error(txErr),
		)
		return nil, fmt.Errorf("auth_service.getOrCreateUser: %w", txErr)
	}

	return newAcc, nil
}

func (s *service) createSessionAndTokens(
	ctx context.Context,
	acc *Account,
	clientType ClientType,
	keys KeyPair,
	maxSessions int64,
	ipAddress, userAgent string,
	logger *zaplog.Logger,
) (*Token, error) {
	accID := acc.ID.String()
	clientKey := strings.ToLower(clientType.String())
	sessionID := uuid.New().String()
	sessionKey := fmt.Sprintf("%s:%s:session:%s", clientKey, accID, sessionID)
	accSessionsKey := fmt.Sprintf("%s:%s:sessions", clientKey, accID)

	if err := s.sessionRepo.TrimSessionsByCapacity(
		ctx,
		accID,
		accSessionsKey,
		clientKey,
		maxSessions,
	); err != nil {
		logger.Warn(
			"failed to trim session capacity",
			zap.String("account_id", accID),
			zap.Error(err),
		)
	}

	accessToken, err := s.jwtSvc.SignRS256(
		accID,
		sessionID,
		acc.Email,
		acc.Roles,
		clientType.String(),
		s.authCfg.AccessTTL,
		s.authCfg.Audience,
		keys.AccessPrivateKey,
	)
	if err != nil {
		logger.Error("failed to sign access token", zap.String("account_id", accID), zap.Error(err))
		return nil, err
	}

	refreshToken, err := s.jwtSvc.SignRS256(
		accID,
		sessionID,
		acc.Email,
		acc.Roles,
		clientType.String(),
		s.authCfg.RefreshTTL,
		s.authCfg.Audience,
		keys.RefreshPrivateKey,
	)
	if err != nil {
		logger.Error(
			"failed to sign refresh token",
			zap.String("account_id", accID),
			zap.Error(err),
		)
		return nil, err
	}

	sessionMeta := session.Metadata{
		SessionID: sessionID,
		TokenHash: secret.HashToken(refreshToken),
		IPAddress: ipAddress,
		UserAgent: userAgent,
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	if err := s.sessionRepo.Create(
		ctx,
		sessionID,
		sessionKey,
		accSessionsKey,
		&sessionMeta,
		s.authCfg.RefreshTTL,
	); err != nil {
		logger.Error("failed to store device session in repository",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
			zap.Error(err),
		)
		return nil, fmt.Errorf("authService.createSessionAndTokens: %w", err)
	}

	logger.Info("authenticated successfully",
		zap.String("account_id", accID),
		zap.String("session_id", sessionID),
		zap.String("client_type", clientType.String()),
	)

	return &Token{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) validateAndFetchSession(
	ctx context.Context,
	sessionKey, accSessionsKey, accID, sessionID, refreshToken string,
	logger *zaplog.Logger,
) (*session.Metadata, error) {
	sessionMeta, err := s.sessionRepo.GetMetadata(ctx, sessionKey)
	if err != nil {
		if errors.Is(err, session.ErrTokenNotFound) {
			logger.Warn("refresh attempt on non-existent or revoked session",
				zap.String("account_id", accID),
				zap.String("session_id", sessionID),
			)
			return nil, errs.NewUnauthorizedError("Session has expired or been revoked.")
		}

		logger.Error("failed to retrieve session from repository",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
			zap.Error(err),
		)
		return nil, fmt.Errorf("authService.RotateTokens: %w", err)
	}

	incomingHash := secret.HashToken(refreshToken)
	if sessionMeta.TokenHash != "" &&
		subtle.ConstantTimeCompare([]byte(sessionMeta.TokenHash), []byte(incomingHash)) != 1 {
		logger.Warn("token reuse or mismatch detected",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
		)

		_, _ = s.sessionRepo.Revoke(ctx, sessionKey, accSessionsKey)
		return nil, errs.NewUnauthorizedError("Invalid refresh token.")
	}

	return sessionMeta, nil
}

func (s *service) issueRotatedTokens(
	ctx context.Context,
	claims *jwt.AuthClaims,
	sessionMeta *session.Metadata,
	sessionID, sessionKey, accSessionsKey string,
	clientType ClientType,
	keys RotateKeys,
	logger *zaplog.Logger,
) (*Token, error) {
	accID := claims.Subject

	newAccessToken, err := s.jwtSvc.SignRS256(
		accID,
		sessionID,
		claims.Email,
		claims.Roles,
		clientType.String(),
		s.authCfg.AccessTTL,
		s.authCfg.Audience,
		keys.AccessPrivateKey,
	)
	if err != nil {
		logger.Error("failed to sign new access token during refresh",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
			zap.Error(err),
		)
		return nil, fmt.Errorf("authService.RotateTokens: %w", err)
	}

	newRefreshToken, err := s.jwtSvc.SignRS256(
		accID,
		sessionID,
		claims.Email,
		claims.Roles,
		clientType.String(),
		s.authCfg.RefreshTTL,
		s.authCfg.Audience,
		keys.RefreshPrivateKey,
	)
	if err != nil {
		logger.Error("failed to sign new refresh token during refresh",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
			zap.Error(err),
		)
		return nil, fmt.Errorf("authService.RotateTokens: %w", err)
	}

	sessionMeta.TokenHash = secret.HashToken(newRefreshToken)
	sessionMeta.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	if err := s.sessionRepo.Create(
		ctx,
		sessionID,
		sessionKey,
		accSessionsKey,
		sessionMeta,
		s.authCfg.RefreshTTL,
	); err != nil {
		logger.Error("failed to create session during rotate tokens",
			zap.String("account_id", accID),
			zap.String("session_id", sessionID),
			zap.Error(err),
		)
		return nil, fmt.Errorf("authService.RotateTokens: %w", err)
	}

	logger.Info("tokens refreshed successfully",
		zap.String("account_id", accID),
		zap.String("session_id", sessionID),
	)

	return &Token{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil
}
