// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package api

// API status constants represent standardized application-level response codes.
const (
	StatusSuccess              = "SUCCESS"
	StatusInvalidInput         = "INVALID_INPUT"
	StatusBadRequest           = "BAD_REQUEST"
	StatusUnauthorized         = "UNAUTHORIZED"
	StatusTokenNotMatched      = "TOKEN_NOT_MATCHED"
	StatusExpiredOTP           = "EXPIRED_OTP"
	StatusForbidden            = "FORBIDDEN"
	StatusNotFound             = "NOT_FOUND"
	StatusRequestTimeout       = "REQUEST_TIMEOUT"
	StatusConflict             = "CONFLICT"
	StatusFileTooLarge         = "FILE_TOO_LARGE"
	StatusUnsupportedMediaType = "UNSUPPORTED_MEDIA_TYPE"
	StatusUnprocessableContent = "UNPROCESSABLE_CONTENT"
	StatusUnexpected           = "UNEXPECTED"
)
