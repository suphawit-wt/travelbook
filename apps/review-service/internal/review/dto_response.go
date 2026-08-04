// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import "time"

// Response represents the JSON response payload for a review.
type Response struct {
	ID              string      `json:"id"`
	PropertyID      string      `json:"propertyId"`
	BookingID       string      `json:"bookingId"`
	UserID          string      `json:"userId"`
	UserDisplayName *string     `json:"userDisplayName"`
	UserCountryCode *string     `json:"userCountryCode"`
	Rating          int16       `json:"rating"`
	SubRatings      *SubRatings `json:"subRatings,omitempty"`
	Comment         *string     `json:"comment,omitempty"`
	CreatedAt       time.Time   `json:"createdAt"`
	UpdatedAt       time.Time   `json:"updatedAt"`
}

// FromDomain converts a domain Review entity into a Response DTO pointer.
func (r *Response) FromDomain(d *Review) *Response {
	return &Response{
		ID:              d.ID.String(),
		PropertyID:      d.PropertyID.String(),
		BookingID:       d.BookingID.String(),
		UserID:          d.UserID.String(),
		UserDisplayName: d.UserDisplayName,
		UserCountryCode: d.UserCountryCode,
		Rating:          d.Rating,
		SubRatings: &SubRatings{
			Staff:       d.SubRatings.Staff,
			Cleanliness: d.SubRatings.Cleanliness,
			Facilities:  d.SubRatings.Facilities,
			Comfort:     d.SubRatings.Comfort,
			Value:       d.SubRatings.Value,
			Location:    d.SubRatings.Location,
			Wifi:        d.SubRatings.Wifi,
		},
		Comment:   d.Comment,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}

// SubRatings contains detailed ratings across individual categories.
type SubRatings struct {
	Staff       *int16 `json:"staff,omitempty"       binding:"omitempty,gte=1,lte=10"`
	Cleanliness *int16 `json:"cleanliness,omitempty" binding:"omitempty,gte=1,lte=10"`
	Facilities  *int16 `json:"facilities,omitempty"  binding:"omitempty,gte=1,lte=10"`
	Comfort     *int16 `json:"comfort,omitempty"     binding:"omitempty,gte=1,lte=10"`
	Value       *int16 `json:"value,omitempty"       binding:"omitempty,gte=1,lte=10"`
	Location    *int16 `json:"location,omitempty"    binding:"omitempty,gte=1,lte=10"`
	Wifi        *int16 `json:"wifi,omitempty"        binding:"omitempty,gte=1,lte=10"`
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
	Data       T      `json:"data"       swaggerignore:"true"`
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
