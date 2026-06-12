// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package dto

// ErrResponse represents the structure for individual error responses within the API.
type ErrResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}
