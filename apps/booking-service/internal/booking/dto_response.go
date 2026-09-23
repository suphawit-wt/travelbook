// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import "time"

// GetBookingByIDResponse defines the structure of the response for the GetBookingByID endpoint.
type GetBookingByIDResponse struct {
	Property propertyInfoResponse `json:"property"`
	Booking  bookingInfoResponse  `json:"booking"`
}

type propertyInfoResponse struct {
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	AvgRating   float64 `json:"avgRating"`
	ReviewCount uint32  `json:"reviewCount"`
	CountryCode string  `json:"countryCode"`
	City        string  `json:"city"`
	Area        string  `json:"area"`
	ZipCode     string  `json:"zipCode"`
}

type bookingInfoResponse struct {
	CheckIn        string                    `json:"checkIn"`
	CheckOut       string                    `json:"checkOut"`
	Nights         uint8                     `json:"nights"`
	Guests         guestResponse             `json:"guests"`
	Rooms          []roomBookingInfoResponse `json:"rooms"`
	TotalRooms     uint8                     `json:"totalRooms"`
	TotalPrice     float64                   `json:"totalPrice"`
	TaxesAndFees   float64                   `json:"taxesAndFees"`
	FreeCancelDate string                    `json:"freeCancelDate"`
}

type guestResponse struct {
	Adults   uint8 `json:"adults"`
	Children uint8 `json:"children"`
}

type roomBookingInfoResponse struct {
	Name     string `json:"name"`
	Quantity uint8  `json:"quantity"`
}

// FromDomain maps domain entities to the GetBookingByIDResponse structure.
func (r *GetBookingByIDResponse) FromDomain(
	p *PropertyInfo,
	b *Info,
) *GetBookingByIDResponse {
	return &GetBookingByIDResponse{
		Property: propertyInfoResponse{
			Name:        p.Name,
			Type:        p.Type,
			AvgRating:   p.AvgRating,
			ReviewCount: p.ReviewCount,
			CountryCode: p.CountryCode,
			City:        p.City,
			Area:        p.Area,
			ZipCode:     p.ZipCode,
		},
		Booking: bookingInfoResponse{
			CheckIn:  b.CheckIn,
			CheckOut: b.CheckOut,
			Nights:   b.Nights,
			Guests: guestResponse{
				Adults:   b.Guests.Adults,
				Children: b.Guests.Children,
			},
			Rooms: func() []roomBookingInfoResponse {
				rooms := make([]roomBookingInfoResponse, len(b.Rooms))
				for i, r := range b.Rooms {
					rooms[i] = roomBookingInfoResponse{
						Name:     r.Name,
						Quantity: r.Quantity,
					}
				}
				return rooms
			}(),
			TotalRooms:     b.TotalRooms,
			TotalPrice:     b.TotalPrice,
			TaxesAndFees:   b.TaxesAndFees,
			FreeCancelDate: b.FreeCancelDate,
		},
	}
}

// CreateBookingResponse defines the structure of the response for the CreateBooking endpoint.
type CreateBookingResponse struct {
	BookingID string    `json:"bookingId"`
	ExpiresAt time.Time `json:"expiresAt"`
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
