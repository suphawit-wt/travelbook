// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package propertyclient

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// ReserveResponse contains reservation confirmation details.
type ReserveResponse struct {
	ReservationID uuid.UUID          `json:"reservationId"`
	PropertyID    uuid.UUID          `json:"propertyId"`
	ExpiresAt     time.Time          `json:"expiresAt"`
	TotalUSD      decimal.Decimal    `json:"totalUsd"`
	TotalLocal    decimal.Decimal    `json:"totalLocal"`
	ExchangeRate  decimal.Decimal    `json:"exchangeRate"`
	ReservedRooms []ReservedRoomItem `json:"reservedRooms"`
}

// ReservedRoomItem contains room level reservation details.
type ReservedRoomItem struct {
	RoomTypeID       uuid.UUID       `json:"roomTypeId"`
	RoomName         string          `json:"roomName"`
	RatePlanID       uuid.UUID       `json:"ratePlanId"`
	Quantity         int             `json:"quantity"`
	PricePerNightUSD decimal.Decimal `json:"pricePerNightUsd"`
}

// ApiResponse represents the standard structure for API responses, including status, status code, message, and optional error details.
type ApiResponse struct {
	Status     string        `json:"status"`
	StatusCode int           `json:"statusCode"`
	Message    string        `json:"message"`
	Errors     []ErrResponse `json:"errors,omitempty" swaggerignore:"true"`
}

// ApiResponseWithData represents the standard structure for API responses that include data, along with status and status code.
type ApiResponseWithData[T any] struct {
	Status     string `json:"status"`
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message,omitempty"`
	Data       T      `json:"data"              swaggerignore:"true"`
}

// ApiResponseWithDataAndPagination includes both data and pagination metadata for API responses
type ApiResponseWithDataAndPagination[T any] struct {
	Data       T               `json:"data"                 swaggerignore:"true"`
	Pagination *PaginationMeta `json:"pagination,omitempty"`
	Status     string          `json:"status"`
	StatusCode int             `json:"statusCode"`
}

// PaginationMeta provides metadata for paginated responses, indicating the current page, items per page, and whether there are next or previous pages.
type PaginationMeta struct {
	Page       int  `json:"page,omitempty"`
	PerPage    int  `json:"perPage,omitempty"`
	TotalCount int  `json:"totalCount"`
	HasNext    bool `json:"hasNext"`
	HasPrev    bool `json:"hasPrev,omitempty"`
}

// ErrResponse represents the structure for individual error responses within the API.
type ErrResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}
