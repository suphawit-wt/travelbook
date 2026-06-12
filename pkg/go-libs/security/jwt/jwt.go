// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwt

import (
	"crypto/ecdsa"
	"crypto/rsa"
	"time"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// Service defines methods for signing and verifying JWT tokens.
type Service interface {
	SignHS256(
		userID string,
		sessionID string,
		email string,
		roles []string,
		clientType string,
		ttl time.Duration,
		audience []string,
		secretKey string,
	) (string, error)
	SignRS256(
		userID string,
		sessionID string,
		email string,
		roles []string,
		clientType string,
		ttl time.Duration,
		audience []string,
		privateKey *rsa.PrivateKey,
	) (string, error)
	SignES256(
		userID string,
		sessionID string,
		email string,
		roles []string,
		clientType string,
		ttl time.Duration,
		audience []string,
		privateKey *ecdsa.PrivateKey,
	) (string, error)
	VerifyHS256(tokenStr, secretKey string) (*AuthClaims, error)
	VerifyRS256(tokenStr string, publicKey *rsa.PublicKey) (*AuthClaims, error)
	VerifyES256(tokenStr string, publicKey *ecdsa.PublicKey) (*AuthClaims, error)
}

type jwtService struct {
	cfg config.JWTConfig
}

// NewService constructs a new JWT service instance with given options.
func NewService(cfg config.JWTConfig) Service {
	return &jwtService{cfg: cfg}
}
