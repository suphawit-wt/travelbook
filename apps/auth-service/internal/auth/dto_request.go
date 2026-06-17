// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

// UserSignInRequest represents the expected payload for a user sign-in request.
type UserSignInRequest struct {
	Email string `json:"email" binding:"required,email,lte=254"`
}

// UserVerifyEmailRequest represents the expected payload for verifying a user's email with an OTP.
type UserVerifyEmailRequest struct {
	Email string `json:"email" binding:"required,email,lte=254"`
	OTP   string `json:"otp"   binding:"required,alphanum,len=6"`
}
