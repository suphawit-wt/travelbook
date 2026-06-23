// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package partner

import (
	"time"

	"github.com/google/uuid"
)

// Partner represents a partner entity in the system.
type Partner struct {
	ID uuid.UUID `json:"id" db:"id"`

	Email    string `json:"email"    db:"email"`
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`

	FirstName   string `json:"firstName"   db:"first_name"`
	LastName    string `json:"lastName"    db:"last_name"`
	PhoneNumber string `json:"phoneNumber" db:"phone_number"`

	Status Status `json:"status" db:"status"`

	CreatedAt time.Time  `json:"createdAt"           db:"created_at"`
	UpdatedAt time.Time  `json:"updatedAt"           db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt,omitempty" db:"deleted_at"`
}
