// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package payment

// CreateBookingPaymentIntentRequest defines the expected payload for creating a new booking.
type CreateBookingPaymentIntentRequest struct {
	BookingID string `json:"bookingId" binding:"required,uuid"`
}
