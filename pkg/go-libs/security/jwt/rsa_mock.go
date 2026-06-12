// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwt

import (
	"crypto/rsa"
	"time"
)

// SignRS256 provides a mock implementation for RS256 token signing.
func (m *ServiceMock) SignRS256(
	userID string,
	sessionID string,
	email string,
	roles []string,
	clientType string,
	ttl time.Duration,
	audience []string,
	privateKey *rsa.PrivateKey,
) (string, error) {
	args := m.Called(userID, sessionID, email, roles, clientType, ttl, audience, privateKey)
	return args.String(0), args.Error(1)
}

// VerifyRS256 provides a mock implementation for RS256 token verification.
func (m *ServiceMock) VerifyRS256(
	tokenStr string,
	publicKey *rsa.PublicKey,
) (*AuthClaims, error) {
	args := m.Called(tokenStr, publicKey)

	if claims, ok := args.Get(0).(*AuthClaims); ok {
		return claims, args.Error(1)
	}

	return nil, args.Error(1)
}
