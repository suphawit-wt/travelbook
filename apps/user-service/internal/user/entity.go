// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"time"

	"github.com/google/uuid"
)

// User represents the user entity
type User struct {
	ID uuid.UUID `db:"id"`

	DisplayName *string `db:"display_name"`
	PhoneNumber *string `db:"phone_number"`
	AvatarKey   *string `db:"avatar_key"`
	AvatarURL   *string `db:"avatar_url"`

	FirstName   *string    `db:"first_name"`
	LastName    *string    `db:"last_name"`
	DateOfBirth *time.Time `db:"date_of_birth"`
	Gender      *string    `db:"gender"`
	Nationality *string    `db:"nationality"`

	CountryCode  *string `db:"country_code"`
	AddressLine1 *string `db:"address_line1"`
	City         *string `db:"city"`
	ZipCode      *string `db:"zip_code"`

	PassportFirstName    *string    `db:"passport_first_name"`
	PassportLastName     *string    `db:"passport_last_name"`
	PassportNumber       *string    `db:"passport_number"`
	PassportIssueCountry *string    `db:"passport_issue_country"`
	PassportExpireDate   *time.Time `db:"passport_expire_date"`

	GeniusTier uint8 `db:"genius_tier"`

	CreatedAt time.Time  `db:"created_at"`
	UpdatedAt time.Time  `db:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at"`
}
