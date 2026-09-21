// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"time"

	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
)

// Restore represents the details needed to release or restore a booking's inventory.
type Restore struct {
	PropertyID uuid.UUID
	CheckIn    time.Time
	CheckOut   time.Time
	Rooms      []RoomItem
}

// RoomItem represents a RoomItem metadata of property booking.
type RoomItem struct {
	RoomTypeID string
	Quantity   int
}

// ToBookingReleaseDTO maps a Restore entity to a ReleaseBookingRequest client DTO.
func (d *Restore) ToBookingReleaseDTO() *propertyclient.ReleaseBookingRequest {
	rooms := make([]propertyclient.ReleaseRoom, len(d.Rooms))
	for i, room := range d.Rooms {
		rooms[i] = propertyclient.ReleaseRoom{
			RoomTypeID: room.RoomTypeID,
			Quantity:   room.Quantity,
		}
	}

	return &propertyclient.ReleaseBookingRequest{
		PropertyID: d.PropertyID.String(),
		CheckIn:    d.CheckIn,
		CheckOut:   d.CheckOut,
		Rooms:      rooms,
	}
}
