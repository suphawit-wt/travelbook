// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"time"

	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

// URI defines the expected URI parameters for property-related endpoints.
type URI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// CreatePropertyRequest defines the expected payload for creating a new property.
type CreatePropertyRequest struct {
	Name          string `json:"name"          binding:"required,lte=90"`
	Type          Type   `json:"type"          binding:"required,eq=hotel|eq=apartment|eq=resort|eq=villa|eq=cabin"`
	Timezone      string `json:"timezone"      binding:"required,timezone"`
	CheckInFrom   string `json:"checkInFrom"   binding:"required,datetime=15:04:05"`
	CheckInUntil  string `json:"checkInUntil"  binding:"required,datetime=15:04:05"`
	CheckOutFrom  string `json:"checkOutFrom"  binding:"required,datetime=15:04:05"`
	CheckOutUntil string `json:"checkOutUntil" binding:"required,datetime=15:04:05"`
}

// ToDomain converts the CreatePropertyRequest into a CreateProperty, preparing it for use in the domain layer.
func (r *CreatePropertyRequest) ToDomain(partnerID uuid.UUID) (*CreateProperty, error) {
	checkInFrom, err := time.Parse(time.TimeOnly, r.CheckInFrom)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check In From type")
	}

	checkInUntil, err := time.Parse(time.TimeOnly, r.CheckInUntil)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check In From type")
	}

	checkOutFrom, err := time.Parse(time.TimeOnly, r.CheckOutFrom)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check In From type")
	}

	checkOutUntil, err := time.Parse(time.TimeOnly, r.CheckOutUntil)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid Check In From type")
	}

	return &CreateProperty{
		Name:          r.Name,
		Type:          r.Type,
		Timezone:      r.Timezone,
		CheckInFrom:   checkInFrom,
		CheckInUntil:  checkInUntil,
		CheckOutFrom:  checkOutFrom,
		CheckOutUntil: checkOutUntil,
		PartnerID:     partnerID,
	}, nil
}

// UpdatePropertyLocationRequest defines the expected payload for updating a property's location information.
type UpdatePropertyLocationRequest struct {
	AreaID       string  `json:"areaId"       binding:"required,uuid"`
	ZipCode      string  `json:"zipCode"      binding:"required"`
	AddressLine1 string  `json:"addressLine1" binding:"required,lte=80"`
	AddressLine2 *string `json:"addressLine2" binding:"omitempty,lte=80"`
	Latitude     float64 `json:"latitude"     binding:"required,latitude"`
	Longitude    float64 `json:"longitude"    binding:"required,longitude"`
}

// ToDomain converts the UpdatePropertyLocationRequest into a PropertyLocation, preparing it for use in the domain layer.
func (r *UpdatePropertyLocationRequest) ToDomain() *Location {
	return &Location{
		AreaID:       r.AreaID,
		ZipCode:      r.ZipCode,
		AddressLine1: r.AddressLine1,
		AddressLine2: r.AddressLine2,
		Latitude:     r.Latitude,
		Longitude:    r.Longitude,
	}
}
