// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"time"

	"github.com/google/uuid"
)

// Account represents a core user entity with authentication credentials, email verification status, roles, and timestamp metadata.
type Account struct {
	ID            uuid.UUID `db:"id"`
	Email         string    `db:"email"`
	Username      *string   `db:"username"`
	PasswordHash  *string   `db:"password_hash"`
	EmailVerified bool      `db:"email_verified"`
	Roles         []string
	CreatedAt     time.Time  `db:"created_at"`
	UpdatedAt     time.Time  `db:"updated_at"`
	DeletedAt     *time.Time `db:"deleted_at"`
}

// AccountOAuthProvider links an Account to a third-party authentication provider identity (e.g., Google, Facebook).
type AccountOAuthProvider struct {
	ID             uuid.UUID `db:"id"`
	AccountID      uuid.UUID `db:"account_id"`
	Provider       string    `db:"provider"`
	ProviderUserID string    `db:"provider_user_id"`
	CreatedAt      time.Time `db:"created_at"`
}

// AccountRole maps an account to a specific authorization role within the system.
type AccountRole struct {
	AccountID uuid.UUID `db:"account_id"`
	Role      string    `db:"role"`
}

// HasRole checks if the Account contains the specified role.
func (a *Account) HasRole(role Role) bool {
	for _, r := range a.Roles {
		if Role(r) == role {
			return true
		}
	}
	return false
}
