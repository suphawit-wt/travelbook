// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

// Type represents the type of a property.
type Type string

// List of valid Type values.
const (
	TypeHotel     Type = "hotel"
	TypeApartment Type = "apartment"
	TypeResort    Type = "resort"
	TypeVilla     Type = "villa"
	TypeCabin     Type = "cabin"
)

// Status represents the status of a property.
type Status string

// List of valid Status values.
const (
	StatusDraft    Status = "draft"
	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
	StatusDeleted  Status = "deleted"
)

// AreaType represents the type of an area item.
type AreaType string

// List of valid AreaType values.
const (
	AreaTypeCafeBar AreaType = "cafeBar"
	AreaTypePeak    AreaType = "peak"
	AreaTypeTrain   AreaType = "train"
	AreaTypeBus     AreaType = "bus"
)
