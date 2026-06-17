// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package session

// Metadata represents the metadata associated with an auth session
type Metadata struct {
	SessionID string `json:"sessionId"`
	TokenHash string `json:"tokenHash"`
	IPAddress string `json:"ipAddress"`
	UserAgent string `json:"userAgent"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}
