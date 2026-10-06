// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth_test

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"errors"
	"net/http"
	"testing"
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"

	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/auth"
	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/outbox"
	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/session"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/passwd"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/secret"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
)

type ServiceTestSuite struct {
	suite.Suite
	ctx             context.Context
	mockAuthRepo    *auth.MockRepository
	mockSessionRepo *session.MockRepository
	mockOutboxRepo  *outbox.MockRepository
	mockJWT         *jwt.ServiceMock
	mockPasswd      *passwd.EncoderMock
	mockKafka       *messaging.KafkaProducerMock
	mockTxMgr       *database.TxManagerMock
	mockTx          *database.PgxTxMock
	rsaPrivateKey   *rsa.PrivateKey
	rsaPublicKey    *rsa.PublicKey
	service         auth.Service
}

func (s *ServiceTestSuite) SetupTest() {
	s.ctx = context.Background()
	s.mockAuthRepo = new(auth.MockRepository)
	s.mockSessionRepo = new(session.MockRepository)
	s.mockOutboxRepo = new(outbox.MockRepository)
	s.mockJWT = new(jwt.ServiceMock)
	s.mockPasswd = new(passwd.EncoderMock)
	s.mockKafka = new(messaging.KafkaProducerMock)
	s.mockTxMgr = new(database.TxManagerMock)
	s.mockTx = new(database.PgxTxMock)

	privKey, err := rsa.GenerateKey(rand.Reader, 2048)
	s.Require().NoError(err)
	s.rsaPrivateKey = privKey
	s.rsaPublicKey = &privKey.PublicKey

	keys := &jwtkey.Keys{}
	keys.User.Access.Private = privKey
	keys.User.Refresh.Private = privKey
	keys.Partner.Access.Private = privKey
	keys.Partner.Refresh.Private = privKey
	keys.Partner.Verify = "verify-secret"

	cfg := &config.AuthConfig{
		Audience:   []string{"travelbook.localhost"},
		AccessTTL:  15 * time.Minute,
		RefreshTTL: 7 * 24 * time.Hour,
	}

	logger := zaplog.NewNop()

	s.service = auth.NewService(
		logger,
		cfg,
		s.mockJWT,
		keys,
		s.mockPasswd,
		s.mockKafka,
		s.mockTxMgr,
		s.mockAuthRepo,
		s.mockSessionRepo,
		s.mockOutboxRepo,
	)
}

// --- Test Cases ---
// ==========================================
// UserSignInWithEmail
// ==========================================

func (s *ServiceTestSuite) TestUserSignInWithEmail_NewUser_Success() {
	email := "newuser12@example.com"
	otpKey := "otp:user:email:" + email

	s.mockSessionRepo.On("SaveOTP", s.ctx, otpKey, mock.Anything, mock.Anything).Return(nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, email).Return(nil, auth.ErrAccountNotFound)
	s.mockKafka.On("Publish", s.ctx, "dev.email.auth.notifications.v1", []byte(email), mock.Anything).
		Return(nil)

	err := s.service.UserSignInWithEmail(s.ctx, email)

	s.NoError(err)
}

func (s *ServiceTestSuite) TestUserSignInWithEmail_SaveOTPError() {
	email := "fail@example.com"
	otpKey := "otp:user:email:" + email

	s.mockSessionRepo.On("SaveOTP", s.ctx, otpKey, mock.Anything, mock.Anything).
		Return(errors.New("redis down"))

	err := s.service.UserSignInWithEmail(s.ctx, email)

	s.ErrorContains(err, "redis down")
}

func (s *ServiceTestSuite) TestUserSignInWithEmail_RepoError() {
	email := "dbfail@example.com"
	otpKey := "otp:user:email:" + email

	s.mockSessionRepo.On("SaveOTP", s.ctx, otpKey, mock.Anything, mock.Anything).Return(nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, email).Return(nil, errors.New("db error"))

	err := s.service.UserSignInWithEmail(s.ctx, email)

	s.ErrorContains(err, "db error")
}

func (s *ServiceTestSuite) TestUserSignInWithEmail_KafkaPublishFailure_DeleteOTPError() {
	email := "kafka-fail2@example.com"
	otpKey := "otp:user:email:" + email

	s.mockSessionRepo.On("SaveOTP", s.ctx, otpKey, mock.Anything, mock.Anything).Return(nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, email).Return(&auth.Account{}, nil)
	s.mockKafka.On("Publish", s.ctx, mock.Anything, []byte(email), mock.Anything).
		Return(errors.New("kafka error"))
	s.mockSessionRepo.On("DeleteOTP", s.ctx, otpKey).Return(false, errors.New("delete error"))

	err := s.service.UserSignInWithEmail(s.ctx, email)

	s.ErrorContains(err, "kafka error")
}

// ==========================================
// UserVerifyEmail
// ==========================================

func (s *ServiceTestSuite) TestUserVerifyEmail_ExistingUser_Success() {
	email := "user@example.com"
	otp := "123456"
	otpKey := "otp:user:email:" + email
	accID := uuid.New()

	acc := &auth.Account{ID: accID, Email: email, Roles: []string{"CUSTOMER"}}

	s.mockSessionRepo.On("VerifyOTP", s.ctx, otpKey, otp).Return(true, nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, email).Return(acc, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "customer", int64(5)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, email, acc.Roles, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, email, acc.Roles, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	tok, err := s.service.UserVerifyEmail(s.ctx, email, otp, "127.0.0.1", "Agent")

	s.NoError(err)
	s.Equal("access", tok.AccessToken)
	s.Equal("refresh", tok.RefreshToken)
}

func (s *ServiceTestSuite) TestUserVerifyEmail_NewUser_Success() {
	email := "newuser@example.com"
	otp := "123456"
	otpKey := "otp:user:email:" + email

	s.mockSessionRepo.On("VerifyOTP", s.ctx, otpKey, otp).Return(true, nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, email).Return(nil, auth.ErrAccountNotFound)
	s.mockAuthRepo.On("CreateAccount", s.ctx, mock.Anything, mock.Anything).
		Return(&auth.Account{ID: uuid.New(), Email: email, Roles: []string{"CUSTOMER"}}, nil).
		Once()
	s.mockOutboxRepo.On("Create", s.ctx, mock.Anything, "user", mock.Anything, "UserProfileCreated", "dev.user.profile.create.v1", mock.Anything).
		Return(nil).
		Once()
	s.mockTxMgr.On("ExecInTx", s.ctx, mock.Anything, mock.Anything).
		Return(nil)

	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, mock.Anything, mock.Anything, "customer", int64(5)).
		Return(nil)
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, email, mock.Anything, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access", nil).
		Once()
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, email, mock.Anything, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	tok, err := s.service.UserVerifyEmail(s.ctx, email, otp, "127.0.0.1", "Agent")

	s.NoError(err)
	s.NotNil(tok)
}

func (s *ServiceTestSuite) TestUserVerifyEmail_OTPNotFound() {
	s.mockSessionRepo.On("VerifyOTP", s.ctx, mock.Anything, mock.Anything).
		Return(false, session.ErrTokenNotFound)

	tok, err := s.service.UserVerifyEmail(s.ctx, "test@test.com", "123456", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestUserVerifyEmail_OTPInternalError() {
	s.mockSessionRepo.On("VerifyOTP", s.ctx, mock.Anything, mock.Anything).
		Return(false, errors.New("redis err"))

	tok, err := s.service.UserVerifyEmail(s.ctx, "test@test.com", "123456", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.ErrorContains(err, "authService.verifyOTP")
}

func (s *ServiceTestSuite) TestUserVerifyEmail_OTPMismatch() {
	s.mockSessionRepo.On("VerifyOTP", s.ctx, mock.Anything, mock.Anything).Return(false, nil)

	tok, err := s.service.UserVerifyEmail(s.ctx, "test@test.com", "123456", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestUserVerifyEmail_GetAccountDBError() {
	s.mockSessionRepo.On("VerifyOTP", s.ctx, mock.Anything, mock.Anything).Return(true, nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, "test@test.com").
		Return(nil, errors.New("db error"))

	tok, err := s.service.UserVerifyEmail(s.ctx, "test@test.com", "123456", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.ErrorContains(err, "db error")
}

func (s *ServiceTestSuite) TestUserVerifyEmail_TxCreateAccountError() {
	s.mockSessionRepo.On("VerifyOTP", s.ctx, mock.Anything, mock.Anything).Return(true, nil)
	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, "test@test.com").
		Return(nil, auth.ErrAccountNotFound)
	s.mockTxMgr.On("ExecInTx", s.ctx, mock.Anything, mock.Anything).
		Return(errors.New("tx create failed"))

	tok, err := s.service.UserVerifyEmail(s.ctx, "test@test.com", "123456", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.ErrorContains(err, "auth_service.getOrCreateUser")
}

// ==========================================
// SignOut
// ==========================================

func (s *ServiceTestSuite) TestSignOut_Success() {
	refreshToken := "valid_refresh_token"
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{
			Subject: uuid.New().String(),
			ID:      uuid.New().String(),
		},
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("Revoke", s.ctx, mock.Anything, mock.Anything).Return(true, nil)

	err := s.service.SignOut(s.ctx, refreshToken, s.rsaPublicKey, auth.ClientTypeCustomer)

	s.NoError(err)
}

func (s *ServiceTestSuite) TestSignOut_AlreadyRevoked() {
	refreshToken := "already_revoked_token"
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{
			Subject: uuid.New().String(),
			ID:      uuid.New().String(),
		},
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("Revoke", s.ctx, mock.Anything, mock.Anything).Return(false, nil)

	err := s.service.SignOut(s.ctx, refreshToken, s.rsaPublicKey, auth.ClientTypeCustomer)

	s.NoError(err)
}

func (s *ServiceTestSuite) TestSignOut_InvalidToken() {
	s.mockJWT.On("VerifyRS256", "invalid", s.rsaPublicKey).Return(nil, errors.New("jwt expired"))

	err := s.service.SignOut(s.ctx, "invalid", s.rsaPublicKey, auth.ClientTypeCustomer)

	var appErr errs.AppError
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestSignOut_RevokeError() {
	refreshToken := "valid_refresh_token"
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{
			Subject: uuid.New().String(),
			ID:      uuid.New().String(),
		},
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("Revoke", s.ctx, mock.Anything, mock.Anything).
		Return(false, errors.New("redis revoke err"))

	err := s.service.SignOut(s.ctx, refreshToken, s.rsaPublicKey, auth.ClientTypeCustomer)

	s.ErrorContains(err, "redis revoke err")
}

// ==========================================
// RotateTokens
// ==========================================

func (s *ServiceTestSuite) TestRotateTokens_Success() {
	refreshToken := "valid_refresh"
	accID := uuid.New().String()
	sessionID := uuid.New().String()

	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{Subject: accID, ID: sessionID},
		Email:            "user@test.com",
		Roles:            []string{"CUSTOMER"},
	}

	hash := secret.HashToken(refreshToken)
	meta := &session.Metadata{SessionID: sessionID, TokenHash: hash}

	keys := auth.RotateKeys{
		AccessPrivateKey:  s.rsaPrivateKey,
		RefreshPrivateKey: s.rsaPrivateKey,
		RefreshPublicKey:  s.rsaPublicKey,
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).Return(meta, nil)
	s.mockJWT.On("SignRS256", accID, sessionID, claims.Email, claims.Roles, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("new_acc", nil).
		Once()
	s.mockJWT.On("SignRS256", accID, sessionID, claims.Email, claims.Roles, "CUSTOMER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("new_ref", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, sessionID, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	tok, err := s.service.RotateTokens(s.ctx, refreshToken, auth.ClientTypeCustomer, keys)

	s.NoError(err)
	s.Equal("new_acc", tok.AccessToken)
	s.Equal("new_ref", tok.RefreshToken)
}

func (s *ServiceTestSuite) TestRotateTokens_VerifyJWTFailed() {
	keys := auth.RotateKeys{RefreshPublicKey: s.rsaPublicKey}
	s.mockJWT.On("VerifyRS256", "bad_token", s.rsaPublicKey).
		Return(nil, errors.New("invalid signature"))

	tok, err := s.service.RotateTokens(s.ctx, "bad_token", auth.ClientTypeCustomer, keys)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestRotateTokens_SessionExpiredOrRevoked() {
	keys := auth.RotateKeys{RefreshPublicKey: s.rsaPublicKey}
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{
			Subject: uuid.New().String(),
			ID:      uuid.New().String(),
		},
	}

	s.mockJWT.On("VerifyRS256", "token", s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).Return(nil, session.ErrTokenNotFound)

	tok, err := s.service.RotateTokens(s.ctx, "token", auth.ClientTypeCustomer, keys)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestRotateTokens_GetMetadataRedisError() {
	keys := auth.RotateKeys{RefreshPublicKey: s.rsaPublicKey}
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{
			Subject: uuid.New().String(),
			ID:      uuid.New().String(),
		},
	}

	s.mockJWT.On("VerifyRS256", "token", s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).
		Return(nil, errors.New("redis failure"))

	tok, err := s.service.RotateTokens(s.ctx, "token", auth.ClientTypeCustomer, keys)

	s.Nil(tok)
	s.ErrorContains(err, "authService.RotateTokens")
}

func (s *ServiceTestSuite) TestRotateTokens_SignAccessTokenError() {
	refreshToken := "valid_refresh"
	accID := uuid.New().String()
	sessionID := uuid.New().String()

	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{Subject: accID, ID: sessionID},
	}
	meta := &session.Metadata{SessionID: sessionID, TokenHash: secret.HashToken(refreshToken)}
	keys := auth.RotateKeys{
		AccessPrivateKey:  s.rsaPrivateKey,
		RefreshPrivateKey: s.rsaPrivateKey,
		RefreshPublicKey:  s.rsaPublicKey,
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).Return(meta, nil)
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("", errors.New("signing err")).
		Once()

	tok, err := s.service.RotateTokens(s.ctx, refreshToken, auth.ClientTypeCustomer, keys)

	s.Nil(tok)
	s.ErrorContains(err, "authService.RotateTokens")
}

func (s *ServiceTestSuite) TestRotateTokens_SignRefreshTokenError() {
	refreshToken := "valid_refresh"
	accID := uuid.New().String()
	sessionID := uuid.New().String()

	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{Subject: accID, ID: sessionID},
	}
	meta := &session.Metadata{SessionID: sessionID, TokenHash: secret.HashToken(refreshToken)}
	keys := auth.RotateKeys{
		AccessPrivateKey:  s.rsaPrivateKey,
		RefreshPrivateKey: s.rsaPrivateKey,
		RefreshPublicKey:  s.rsaPublicKey,
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).Return(meta, nil)
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access", nil).
		Once()
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("", errors.New("refresh sign err")).
		Once()

	tok, err := s.service.RotateTokens(s.ctx, refreshToken, auth.ClientTypeCustomer, keys)

	s.Nil(tok)
	s.ErrorContains(err, "authService.RotateTokens")
}

func (s *ServiceTestSuite) TestRotateTokens_SessionCreateError() {
	refreshToken := "valid_refresh"
	accID := uuid.New().String()
	sessionID := uuid.New().String()

	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{Subject: accID, ID: sessionID},
	}
	meta := &session.Metadata{SessionID: sessionID, TokenHash: secret.HashToken(refreshToken)}
	keys := auth.RotateKeys{
		AccessPrivateKey:  s.rsaPrivateKey,
		RefreshPrivateKey: s.rsaPrivateKey,
		RefreshPublicKey:  s.rsaPublicKey,
	}

	s.mockJWT.On("VerifyRS256", refreshToken, s.rsaPublicKey).Return(claims, nil)
	s.mockSessionRepo.On("GetMetadata", s.ctx, mock.Anything).Return(meta, nil)
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access", nil).
		Once()
	s.mockJWT.On("SignRS256", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(errors.New("session save error"))

	tok, err := s.service.RotateTokens(s.ctx, refreshToken, auth.ClientTypeCustomer, keys)

	s.Nil(tok)
	s.ErrorContains(err, "authService.RotateTokens")
}

// ==========================================
// PartnerSignInWithUsernamePassword
// ==========================================

func (s *ServiceTestSuite) TestPartnerSignIn_ByEmail_Success() {
	identifier := "partner@example.com"
	password := "secret123"
	hashed := "$2a$10$hashedpassword"
	accID := uuid.New()

	acc := &auth.Account{
		ID:            accID,
		Email:         identifier,
		PasswordHash:  &hashed,
		EmailVerified: true,
		Roles:         []string{auth.RolePartnerAdmin.String()},
	}

	s.mockAuthRepo.On("GetAccountByEmail", s.ctx, identifier).Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, password).Return(true, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access_token", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh_token", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	token, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		identifier,
		password,
		"127.0.0.1",
		"UnitTest",
	)

	s.NoError(err)
	s.NotNil(token)
}

func (s *ServiceTestSuite) TestPartnerSignIn_AccountNotFound() {
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "unknown").Return(nil, auth.ErrAccountNotFound)

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"unknown",
		"pass",
		"127.0.0.1",
		"Agent",
	)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerSignIn_DBError() {
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "partner_user").
		Return(nil, errors.New("db error"))

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"partner_user",
		"pass",
		"127.0.0.1",
		"Agent",
	)

	s.Nil(tok)
	s.Error(err)
}

func (s *ServiceTestSuite) TestPartnerSignIn_NoPasswordHash() {
	acc := &auth.Account{ID: uuid.New(), PasswordHash: nil}
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "partner_user").Return(acc, nil)

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"partner_user",
		"pass",
		"127.0.0.1",
		"Agent",
	)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerSignIn_EmailNotVerified() {
	hashed := "$2a$10$hashed"
	acc := &auth.Account{ID: uuid.New(), PasswordHash: &hashed, EmailVerified: false}
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "partner_user").Return(acc, nil)

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"partner_user",
		"pass",
		"127.0.0.1",
		"Agent",
	)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerSignIn_PasswordVerifyError() {
	hashed := "$2a$10$hashed"
	acc := &auth.Account{ID: uuid.New(), PasswordHash: &hashed, EmailVerified: true}
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "partner_user").Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, "wrongpass").Return(false, errors.New("bcrypt err"))

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"partner_user",
		"wrongpass",
		"127.0.0.1",
		"Agent",
	)

	s.Nil(tok)
	s.ErrorContains(err, "auth_service.PartnerSignIn")
}

func (s *ServiceTestSuite) TestPartnerSignIn_PasswordMismatch() {
	hashed := "$2a$10$hashed"
	acc := &auth.Account{ID: uuid.New(), PasswordHash: &hashed, EmailVerified: true}
	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, "partner_user").Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, "wrongpass").Return(false, nil)

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		"partner_user",
		"wrongpass",
		"127.0.0.1",
		"Agent",
	)

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerSignIn_TrimSessionsWarning() {
	identifier := "partner_admin"
	password := "secret123"
	hashed := "$2a$10$hashedpassword"
	accID := uuid.New()

	acc := &auth.Account{
		ID:            accID,
		Email:         "partner@example.com",
		Username:      &identifier,
		PasswordHash:  &hashed,
		EmailVerified: true,
		Roles:         []string{auth.RolePartnerAdmin.String()},
	}

	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, identifier).Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, password).Return(true, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(errors.New("trim warning"))
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access_token", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh_token", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	token, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		identifier,
		password,
		"127.0.0.1",
		"UnitTest",
	)

	s.NoError(err)
	s.NotNil(token)
}

func (s *ServiceTestSuite) TestPartnerSignIn_SignAccessTokenError() {
	identifier := "partner_admin"
	password := "secret123"
	hashed := "$2a$10$hashedpassword"
	accID := uuid.New()

	acc := &auth.Account{
		ID:            accID,
		Email:         "partner@example.com",
		Username:      &identifier,
		PasswordHash:  &hashed,
		EmailVerified: true,
		Roles:         []string{auth.RolePartnerAdmin.String()},
	}

	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, identifier).Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, password).Return(true, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("", errors.New("access sign err")).
		Once()

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		identifier,
		password,
		"127.0.0.1",
		"UnitTest",
	)

	s.Nil(tok)
	s.ErrorContains(err, "access sign err")
}

func (s *ServiceTestSuite) TestPartnerSignIn_SignRefreshTokenError() {
	identifier := "partner_admin"
	password := "secret123"
	hashed := "$2a$10$hashedpassword"
	accID := uuid.New()

	acc := &auth.Account{
		ID:            accID,
		Email:         "partner@example.com",
		Username:      &identifier,
		PasswordHash:  &hashed,
		EmailVerified: true,
		Roles:         []string{auth.RolePartnerAdmin.String()},
	}

	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, identifier).Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, password).Return(true, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access_token", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("", errors.New("refresh sign err")).
		Once()

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		identifier,
		password,
		"127.0.0.1",
		"UnitTest",
	)

	s.Nil(tok)
	s.ErrorContains(err, "refresh sign err")
}

func (s *ServiceTestSuite) TestPartnerSignIn_CreateSessionError() {
	identifier := "partner_admin"
	password := "secret123"
	hashed := "$2a$10$hashedpassword"
	accID := uuid.New()

	acc := &auth.Account{
		ID:            accID,
		Email:         "partner@example.com",
		Username:      &identifier,
		PasswordHash:  &hashed,
		EmailVerified: true,
		Roles:         []string{auth.RolePartnerAdmin.String()},
	}

	s.mockAuthRepo.On("GetAccountByUsername", s.ctx, identifier).Return(acc, nil)
	s.mockPasswd.On("Verify", hashed, password).Return(true, nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access_token", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, acc.Email, acc.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh_token", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(errors.New("session create err"))

	tok, err := s.service.PartnerSignInWithUsernamePassword(
		s.ctx,
		identifier,
		password,
		"127.0.0.1",
		"UnitTest",
	)

	s.Nil(tok)
	s.ErrorContains(err, "authService.createSessionAndTokens")
}

// ==========================================
// PartnerSignUpWithUsernamePassword
// ==========================================

func (s *ServiceTestSuite) TestPartnerSignUp_Success() {
	req := &auth.PartnerSignUpRequest{
		Email:       "partner@test.com",
		Username:    "partner1",
		Password:    "password123",
		FirstName:   "John",
		LastName:    "Doe",
		PhoneNumber: "1234567890",
	}

	accID := uuid.New()

	s.mockPasswd.On("Hash", req.Password).Return("$2a$10$hashed", nil)
	s.mockAuthRepo.On("CreateAccount", mock.Anything, mock.Anything, mock.Anything).
		Return(&auth.Account{ID: accID, Email: req.Email}, nil).
		Once()
	s.mockOutboxRepo.On("Create", mock.Anything, mock.Anything, "partner", accID.String(), "PartnerProfileCreated", "dev.partner.profile.create.v1", mock.Anything).
		Return(nil).
		Once()

	s.mockTxMgr.On("ExecInTx", mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	s.mockJWT.On("SignHS256", mock.Anything, mock.Anything, req.Email, mock.Anything, "PARTNER", mock.Anything, mock.Anything, "verify-secret").
		Return("verify_token", nil)
	s.mockSessionRepo.On("SaveOTP", s.ctx, mock.Anything, "verify_token", mock.Anything).Return(nil)

	err := s.service.PartnerSignUpWithUsernamePassword(s.ctx, req)

	s.NoError(err)
}

func (s *ServiceTestSuite) TestPartnerSignUp_HashPasswordError() {
	req := &auth.PartnerSignUpRequest{Password: "password123"}
	s.mockPasswd.On("Hash", req.Password).Return("", errors.New("hash failed"))

	err := s.service.PartnerSignUpWithUsernamePassword(s.ctx, req)

	s.ErrorContains(err, "hash failed")
}

func (s *ServiceTestSuite) TestPartnerSignUp_TxError() {
	req := &auth.PartnerSignUpRequest{Password: "password123"}
	s.mockPasswd.On("Hash", req.Password).Return("$2a$10$hashed", nil)
	s.mockTxMgr.On("ExecInTx", s.ctx, mock.Anything, mock.Anything).Return(errors.New("tx error"))

	err := s.service.PartnerSignUpWithUsernamePassword(s.ctx, req)

	s.Error(err)
}

func (s *ServiceTestSuite) TestPartnerSignUp_SignHS256Error() {
	req := &auth.PartnerSignUpRequest{
		Email:    "partner@test.com",
		Username: "partner1",
		Password: "password123",
	}

	accID := uuid.New()

	s.mockPasswd.On("Hash", req.Password).Return("$2a$10$hashed", nil)
	s.mockAuthRepo.On("CreateAccount", mock.Anything, mock.Anything, mock.Anything).
		Return(&auth.Account{ID: accID, Email: req.Email}, nil).
		Once()
	s.mockOutboxRepo.On("Create", mock.Anything, mock.Anything, "partner", accID.String(), "PartnerProfileCreated", "dev.partner.profile.create.v1", mock.Anything).
		Return(nil).
		Once()

	s.mockTxMgr.On("ExecInTx", mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	s.mockJWT.On("SignHS256", mock.Anything, mock.Anything, req.Email, mock.Anything, "PARTNER", mock.Anything, mock.Anything, "verify-secret").
		Return("", errors.New("hs256 error"))

	err := s.service.PartnerSignUpWithUsernamePassword(s.ctx, req)

	s.ErrorContains(err, "hs256 error")
}

func (s *ServiceTestSuite) TestPartnerSignUp_SaveOTPError() {
	req := &auth.PartnerSignUpRequest{
		Email:    "partner@test.com",
		Username: "partner1",
		Password: "password123",
	}

	accID := uuid.New()

	s.mockPasswd.On("Hash", req.Password).Return("$2a$10$hashed", nil)

	s.mockAuthRepo.On("CreateAccount", mock.Anything, mock.Anything, mock.Anything).
		Return(&auth.Account{ID: accID, Email: req.Email}, nil).
		Once()
	s.mockOutboxRepo.On("Create", mock.Anything, mock.Anything, "partner", accID.String(), "PartnerProfileCreated", "dev.partner.profile.create.v1", mock.Anything).
		Return(nil).
		Once()

	s.mockTxMgr.On("ExecInTx", mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	s.mockJWT.On("SignHS256", mock.Anything, mock.Anything, req.Email, mock.Anything, "PARTNER", mock.Anything, mock.Anything, "verify-secret").
		Return("verify_token", nil)
	s.mockSessionRepo.On("SaveOTP", s.ctx, mock.Anything, "verify_token", mock.Anything).
		Return(errors.New("save verify token err"))

	err := s.service.PartnerSignUpWithUsernamePassword(s.ctx, req)

	s.ErrorContains(err, "save verify token err")
}

// ==========================================
// PartnerVerifyEmail
// ==========================================

func (s *ServiceTestSuite) TestPartnerVerifyEmail_Success() {
	verifyToken := "valid_token"
	accID := uuid.New()
	claims := &jwt.AuthClaims{
		RegisteredClaims: gojwt.RegisteredClaims{Subject: accID.String()},
		Email:            "partner@test.com",
		Roles:            []string{"PARTNER_ADMIN"},
	}

	s.mockJWT.On("VerifyHS256", verifyToken, "verify-secret").Return(claims, nil)
	s.mockSessionRepo.On("VerifyOTP", s.ctx, "verify:partner:"+accID.String(), verifyToken).
		Return(true, nil)
	s.mockAuthRepo.On("MarkEmailAsVerified", s.ctx, accID).Return(nil)
	s.mockSessionRepo.On("TrimSessionsByCapacity", s.ctx, accID.String(), mock.Anything, "partner", int64(3)).
		Return(nil)
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, claims.Email, claims.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("access", nil).
		Once()
	s.mockJWT.On("SignRS256", accID.String(), mock.Anything, claims.Email, claims.Roles, "PARTNER", mock.Anything, mock.Anything, s.rsaPrivateKey).
		Return("refresh", nil).
		Once()
	s.mockSessionRepo.On("Create", s.ctx, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil)

	tok, err := s.service.PartnerVerifyEmail(s.ctx, verifyToken, "127.0.0.1", "Agent")

	s.NoError(err)
	s.Equal("access", tok.AccessToken)
	s.Equal("refresh", tok.RefreshToken)
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_VerifyHS256Failed() {
	s.mockJWT.On("VerifyHS256", "bad_token", "verify-secret").
		Return(nil, errors.New("invalid hs256"))

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "bad_token", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_InvalidUUID() {
	claims := &jwt.AuthClaims{RegisteredClaims: gojwt.RegisteredClaims{Subject: "invalid-uuid"}}
	s.mockJWT.On("VerifyHS256", "token", "verify-secret").Return(claims, nil)

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "token", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.Error(err)
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_TokenNotFoundInSession() {
	accID := uuid.New()
	claims := &jwt.AuthClaims{RegisteredClaims: gojwt.RegisteredClaims{Subject: accID.String()}}

	s.mockJWT.On("VerifyHS256", "token", "verify-secret").Return(claims, nil)
	s.mockSessionRepo.On("VerifyOTP", s.ctx, "verify:partner:"+accID.String(), "token").
		Return(false, session.ErrTokenNotFound)

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "token", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_SessionRedisError() {
	accID := uuid.New()
	claims := &jwt.AuthClaims{RegisteredClaims: gojwt.RegisteredClaims{Subject: accID.String()}}

	s.mockJWT.On("VerifyHS256", "token", "verify-secret").Return(claims, nil)
	s.mockSessionRepo.On("VerifyOTP", s.ctx, "verify:partner:"+accID.String(), "token").
		Return(false, errors.New("redis err"))

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "token", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.ErrorContains(err, "redis err")
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_TokenMismatch() {
	accID := uuid.New()
	claims := &jwt.AuthClaims{RegisteredClaims: gojwt.RegisteredClaims{Subject: accID.String()}}

	s.mockJWT.On("VerifyHS256", "token", "verify-secret").Return(claims, nil)
	s.mockSessionRepo.On("VerifyOTP", s.ctx, "verify:partner:"+accID.String(), "token").
		Return(false, nil)

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "token", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusUnauthorized, appErr.StatusCode)
}

func (s *ServiceTestSuite) TestPartnerVerifyEmail_MarkEmailAsVerifiedError() {
	accID := uuid.New()
	claims := &jwt.AuthClaims{RegisteredClaims: gojwt.RegisteredClaims{Subject: accID.String()}}

	s.mockJWT.On("VerifyHS256", "token", "verify-secret").Return(claims, nil)
	s.mockSessionRepo.On("VerifyOTP", s.ctx, "verify:partner:"+accID.String(), "token").
		Return(true, nil)
	s.mockAuthRepo.On("MarkEmailAsVerified", s.ctx, accID).Return(errors.New("db error"))

	tok, err := s.service.PartnerVerifyEmail(s.ctx, "token", "127.0.0.1", "Agent")

	s.Nil(tok)
	s.Error(err)
}

// ==========================================
// UserSignInWithGoogleOAuth
// ==========================================

func (s *ServiceTestSuite) TestUserSignInWithGoogleOAuth_InvalidCode() {
	tok, err := s.service.UserSignInWithGoogleOAuth(s.ctx, "invalid_code", "127.0.0.1", "Agent")

	var appErr errs.AppError
	s.Nil(tok)
	s.Require().ErrorAs(err, &appErr)
	s.Equal(http.StatusBadRequest, appErr.StatusCode)
}

func TestServiceTestSuite(t *testing.T) {
	t.Parallel()
	suite.Run(t, new(ServiceTestSuite))
}
