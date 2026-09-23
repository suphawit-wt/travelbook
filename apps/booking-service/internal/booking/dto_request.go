// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"time"

	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

// URI defines the URI parameters for booking-related requests.
type URI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// CreateBookingRequest defines the expected payload for creating a new booking.
type CreateBookingRequest struct {
	PropertyID string        `json:"propertyId" binding:"required,uuid"`
	CheckIn    string        `json:"checkIn"    binding:"required,datetime=2006-01-02"`
	CheckOut   string        `json:"checkOut"   binding:"required,datetime=2006-01-02"`
	Rooms      []roomRequest `json:"rooms"      binding:"required,dive"`
	Guests     guestRequest  `json:"guests"     binding:"required"`
}

type roomRequest struct {
	RoomTypeID string `json:"roomTypeId" binding:"required,uuid"`
	RatePlanID string `json:"ratePlanId" binding:"required,uuid"`
	Quantity   uint8  `json:"quantity"   binding:"required,gte=1"`
}

type guestRequest struct {
	Adults   uint8 `json:"adults"   binding:"required,gte=1"`
	Children uint8 `json:"children" binding:"gte=0"`
}

// ToDomain converts the CreateBookingRequest into a CreateBooking, preparing it for use in the domain layer.
func (r *CreateBookingRequest) ToDomain(currencyCode string) (*CreateBooking, error) {
	rooms := make([]Room, len(r.Rooms))
	for i, room := range r.Rooms {
		roomTypeID, err := uuid.Parse(room.RoomTypeID)
		if err != nil {
			return nil, errs.NewBadRequestError("Invalid Room Type ID type")
		}

		ratePlanID, err := uuid.Parse(room.RatePlanID)
		if err != nil {
			return nil, errs.NewBadRequestError("Invalid Rate Plan ID type")
		}

		rooms[i] = Room{
			RoomTypeID: roomTypeID,
			RatePlanID: ratePlanID,
			Quantity:   room.Quantity,
		}
	}

	propertyID, err := uuid.Parse(r.PropertyID)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Property ID type")
	}

	checkIn, err := time.Parse(time.DateOnly, r.CheckIn)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check In type")
	}
	checkOut, err := time.Parse(time.DateOnly, r.CheckOut)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check Out type")
	}

	nights := uint8(checkOut.Sub(checkIn).Hours() / 24)

	return &CreateBooking{
		PropertyID:   propertyID,
		CheckIn:      checkIn,
		CheckOut:     checkOut,
		Rooms:        rooms,
		Guests:       Guest(r.Guests),
		Nights:       nights,
		CurrencyCode: currencyCode,
	}, nil
}
