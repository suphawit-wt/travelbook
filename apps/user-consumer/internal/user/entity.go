// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user entity in the system, containing personal and contact information.
type User struct {
	ID uuid.UUID `json:"id" db:"id"`

	DisplayName *string `json:"displayName" db:"display_name"`
	PhoneNumber *string `json:"phoneNumber" db:"phone_number"`
	AvatarKey   *string `json:"avatarKey"   db:"avatar_key"`
	AvatarURL   *string `json:"avatarUrl"   db:"avatar_url"`

	FirstName   *string    `json:"firstName"   db:"first_name"`
	LastName    *string    `json:"lastName"    db:"last_name"`
	DateOfBirth *time.Time `json:"dateOfBirth" db:"date_of_birth"`
	Gender      *string    `json:"gender"      db:"gender"`
	Nationality *string    `json:"nationality" db:"nationality"`

	CountryCode  *string `json:"countryCode"  db:"country_code"`
	AddressLine1 *string `json:"addressLine1" db:"address_line1"`
	City         *string `json:"city"         db:"city"`
	ZipCode      *string `json:"zipCode"      db:"zip_code"`

	PassportFirstName    *string    `json:"passportFirstName"    db:"passport_first_name"`
	PassportLastName     *string    `json:"passportLastName"     db:"passport_last_name"`
	PassportNumber       *string    `json:"passportNumber"       db:"passport_number"`
	PassportIssueCountry *string    `json:"passportIssueCountry" db:"passport_issue_country"`
	PassportExpireDate   *time.Time `json:"passportExpireDate"   db:"passport_expire_date"`

	GeniusTier uint8 `json:"geniusTier" db:"genius_tier"`

	CreatedAt time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time  `json:"updatedAt" db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}
