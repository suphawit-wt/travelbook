// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"strings"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/outbox"
	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/session"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/passwd"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
)

// Token represents the access and refresh tokens for authentication
type Token struct {
	AccessToken  string
	RefreshToken string
}

// OTPPayload represents the data payload for OTP generation events.
type OTPPayload struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

// Service defines the data access contract for authentication services.
type Service interface {
	UserSignInWithEmail(ctx context.Context, email string) error
	UserVerifyEmail(
		ctx context.Context,
		email, otp, ipAddress, userAgent string,
	) (*Token, error)
}

type service struct {
	logger          *zaplog.Logger
	authCfg         *config.AuthConfig
	jwtSvc          jwt.Service
	jwtKeys         *jwtkey.Keys
	passwordEncoder passwd.Encoder
	kafkaProducer   messaging.KafkaProducer
	txMgr           database.TxManager
	authRepo        Repository
	sessionRepo     session.Repository
	outboxRepo      outbox.Repository
}

// NewService creates a new instance of Auth Service with the provided dependencies.
func NewService(
	logger *zaplog.Logger,
	authCfg *config.AuthConfig,
	jwtSvc jwt.Service,
	jwtKeys *jwtkey.Keys,
	passwordEncoder passwd.Encoder,
	kafkaProducer messaging.KafkaProducer,
	txMgr database.TxManager,
	authRepo Repository,
	sessionRepo session.Repository,
	outboxRepo outbox.Repository,
) Service {
	return &service{
		logger:          logger,
		authCfg:         authCfg,
		jwtSvc:          jwtSvc,
		jwtKeys:         jwtKeys,
		passwordEncoder: passwordEncoder,
		kafkaProducer:   kafkaProducer,
		txMgr:           txMgr,
		authRepo:        authRepo,
		sessionRepo:     sessionRepo,
		outboxRepo:      outboxRepo,
	}
}

func (s *service) UserSignInWithEmail(ctx context.Context, email string) error {
	logger := s.logger.Named("user_sign_in_with_email")
	email = strings.TrimSpace(strings.ToLower(email))

	otp, err := s.generateAndSaveOTP(ctx, email, logger)
	if err != nil {
		return err
	}

	eventType, err := s.determineOTPEventType(ctx, email, logger)
	if err != nil {
		return err
	}

	payloadBytes, err := s.buildOTPEventPayload(email, otp, eventType)
	if err != nil {
		logger.Error("failed to marshal OTP event payload", zap.Error(err))
		return err
	}

	return s.publishOTPEventWithRollback(ctx, email, payloadBytes, logger)
}

func (s *service) UserVerifyEmail(
	ctx context.Context,
	email, otp, ipAddress, userAgent string,
) (*Token, error) {
	logger := s.logger.Named("user_verify_email")

	normalizedEmail := strings.TrimSpace(strings.ToLower(email))
	normalizedOTP := strings.TrimSpace(strings.ToUpper(otp))

	if err := s.verifyOTP(ctx, normalizedEmail, normalizedOTP, logger); err != nil {
		return nil, err
	}

	acc, err := s.getOrCreateUserAccount(ctx, normalizedEmail, logger)
	if err != nil {
		return nil, err
	}

	keys := KeyPair{
		AccessPrivateKey:  s.jwtKeys.User.Access.Private,
		RefreshPrivateKey: s.jwtKeys.User.Refresh.Private,
	}

	return s.createSessionAndTokens(
		ctx,
		acc,
		ClientTypeCustomer,
		keys,
		5,
		ipAddress,
		userAgent,
		logger,
	)
}
