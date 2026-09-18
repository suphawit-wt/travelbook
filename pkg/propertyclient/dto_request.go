// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package propertyclient

import (
	"time"

	"github.com/google/uuid"
)

// ReserveRequest represents the request payload for reserving property rooms.
type ReserveRequest struct {
	PropertyID   uuid.UUID `json:"-"`
	CheckIn      time.Time `json:"checkIn"`
	CheckOut     time.Time `json:"checkOut"`
	Nights       uint8     `json:"nights"`
	Rooms        []Room    `json:"rooms"`
	Guests       Guest     `json:"guests"`
	CurrencyCode string    `json:"-"`
}

// Room represents a room details item in a reservation request.
type Room struct {
	RoomTypeID uuid.UUID `json:"roomTypeId"`
	RatePlanID uuid.UUID `json:"ratePlanId"`
	Quantity   uint8     `json:"quantity"`
}

// Guest represents the guest occupancy count in a reservation request.
type Guest struct {
	Adults   uint8 `json:"adults"`
	Children uint8 `json:"children"`
}

// ReleaseBookingRequest represents the request payload for releasing a property booking.
type ReleaseBookingRequest struct {
	PropertyID string        `json:"propertyId"`
	CheckIn    time.Time     `json:"checkIn"`
	CheckOut   time.Time     `json:"checkOut"`
	Rooms      []ReleaseRoom `json:"rooms"`
}

// ReleaseRoom represents a room item to be released in a release booking request.
type ReleaseRoom struct {
	RoomTypeID string `json:"roomTypeId"`
	Quantity   int    `json:"quantity"`
}
