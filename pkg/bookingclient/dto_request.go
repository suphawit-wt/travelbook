// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package bookingclient

// ConfirmBookingRequest represents the request payload for confirming a booking.
type ConfirmBookingRequest struct {
	BookingID string `json:"bookingId"`
}
