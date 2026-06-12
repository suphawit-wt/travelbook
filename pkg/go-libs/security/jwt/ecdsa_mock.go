// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwt

import (
	"crypto/ecdsa"
	"time"
)

// SignES256 provides a mock implementation for ES256 token signing.
func (m *ServiceMock) SignES256(
	userID string,
	sessionID string,
	email string,
	roles []string,
	clientType string,
	ttl time.Duration,
	audience []string,
	privateKey *ecdsa.PrivateKey,
) (string, error) {
	args := m.Called(userID, sessionID, email, roles, clientType, ttl, audience, privateKey)
	return args.String(0), args.Error(1)
}

// VerifyES256 provides a mock implementation for ES256 token verification.
func (m *ServiceMock) VerifyES256(
	tokenStr string,
	publicKey *ecdsa.PublicKey,
) (*AuthClaims, error) {
	args := m.Called(tokenStr, publicKey)

	if claims, ok := args.Get(0).(*AuthClaims); ok {
		return claims, args.Error(1)
	}

	return nil, args.Error(1)
}
