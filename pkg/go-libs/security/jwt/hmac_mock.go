// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwt

import (
	"time"
)

// SignHS256 provides a mock implementation for HS256 token signing.
func (m *ServiceMock) SignHS256(
	userID string,
	sessionID string,
	email string,
	roles []string,
	clientType string,
	ttl time.Duration,
	audience []string,
	secretKey string,
) (string, error) {
	args := m.Called(userID, sessionID, email, roles, clientType, ttl, audience, secretKey)
	return args.String(0), args.Error(1)
}

// VerifyHS256 provides a mock implementation for HS256 token verification.
func (m *ServiceMock) VerifyHS256(
	tokenStr string,
	secretKey string,
) (*AuthClaims, error) {
	args := m.Called(tokenStr, secretKey)

	if claims, ok := args.Get(0).(*AuthClaims); ok {
		return claims, args.Error(1)
	}

	return nil, args.Error(1)
}
