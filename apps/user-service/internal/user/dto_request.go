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
