// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package propertyclient

// PropertyType represents the type of a property.
type PropertyType string

// List of valid PropertyType values.
const (
	PropertyTypeHotel     PropertyType = "hotel"
	PropertyTypeApartment PropertyType = "apartment"
	PropertyTypeResort    PropertyType = "resort"
	PropertyTypeVilla     PropertyType = "villa"
	PropertyTypeCabin     PropertyType = "cabin"
)

// PropertyStatus represents the status of a property.
type PropertyStatus string

// List of valid PropertyStatus values.
const (
	PropertyStatusDraft    PropertyStatus = "draft"
	PropertyStatusActive   PropertyStatus = "active"
	PropertyStatusInactive PropertyStatus = "inactive"
	PropertyStatusDeleted  PropertyStatus = "deleted"
)
