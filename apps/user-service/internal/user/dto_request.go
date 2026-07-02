// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

// UpdateNameRequest represents the request body for updating a user's name.
type UpdateNameRequest struct {
	FirstName string `json:"firstName" binding:"required,lte=80"`
	LastName  string `json:"lastName"  binding:"required,lte=80"`
}

// UpdateDisplayNameRequest represents the request body for updating a user's display name.
type UpdateDisplayNameRequest struct {
	DisplayName string `json:"displayName" binding:"required,lte=80"`
}

// UpdatePhoneNumberRequest represents the request body for updating a user's phone number.
type UpdatePhoneNumberRequest struct {
	PhoneNumber string `json:"phoneNumber" binding:"required,e164"`
}

// UpdateDateOfBirthRequest represents the request body for updating a user's date of birth.
type UpdateDateOfBirthRequest struct {
	DateOfBirth string `json:"dateOfBirth" binding:"required,datetime=2006-01-02"`
}

// UpdateNationalityRequest represents the request body for updating
type UpdateNationalityRequest struct {
	Nationality string `json:"nationality" binding:"required,iso3166_1_alpha2"`
}

// UpdateGenderRequest represents the request body for updating
type UpdateGenderRequest struct {
	Gender string `json:"gender" binding:"required,eq=male|eq=female|eq=non_binary|eq=not_say"`
}
