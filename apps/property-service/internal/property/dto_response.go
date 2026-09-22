// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// InfoResponse defines the property information returned in administrative or detailed property list endpoints.
type InfoResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Slug          string `json:"slug"`
	Type          Type   `json:"type"`
	Status        Status `json:"status"`
	Timezone      string `json:"timezone"`
	CheckInFrom   string `json:"checkInFrom"`
	CheckInUntil  string `json:"checkInUntil"`
	CheckOutFrom  string `json:"checkOutFrom"`
	CheckOutUntil string `json:"checkOutUntil"`

	AvgRating   float64 `json:"avgRating"`
	ReviewCount uint32  `json:"reviewCount"`

	CountryCode  *string  `json:"countryCode"`
	Province     *string  `json:"province"`
	City         *string  `json:"city"`
	Area         *string  `json:"area"`
	ZipCode      *string  `json:"zipCode"`
	AddressLine1 *string  `json:"addressLine1"`
	AddressLine2 *string  `json:"addressLine2"`
	Latitude     *float64 `json:"latitude"`
	Longitude    *float64 `json:"longitude"`

	PartnerID string `json:"partnerId"`

	CoverImageURL *string `json:"coverImageUrl"`
}

// FromEntity converts a Property domain entity into a PropertyInfoResponse suitable for API responses.
func (r *InfoResponse) FromEntity(
	entity *Property,
) *InfoResponse {
	return &InfoResponse{
		ID:            entity.ID.String(),
		Name:          entity.Name,
		Slug:          entity.Slug,
		Type:          entity.Type,
		Status:        entity.Status,
		Timezone:      entity.Timezone,
		CheckInFrom:   entity.CheckInFrom.Format("15:04"),
		CheckInUntil:  entity.CheckInUntil.Format("15:04"),
		CheckOutFrom:  entity.CheckOutFrom.Format("15:04"),
		CheckOutUntil: entity.CheckOutUntil.Format("15:04"),
		AvgRating:     entity.AvgRating,
		ReviewCount:   entity.ReviewCount,
		CountryCode:   entity.CountryCode,
		Province:      entity.Province,
		City:          entity.City,
		Area:          entity.Area,
		AddressLine1:  entity.AddressLine1,
		AddressLine2:  entity.AddressLine2,
		ZipCode:       entity.ZipCode,
		Latitude:      entity.Latitude,
		Longitude:     entity.Longitude,
		PartnerID:     entity.PartnerID.String(),
		CoverImageURL: entity.CoverImageURL,
	}
}

// DetailResponse defines the structure of the response for the GetPropertyBySlug endpoint.
type DetailResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Slug          string `json:"slug"`
	Type          Type   `json:"type"`
	Timezone      string `json:"timezone"`
	CheckInFrom   string `json:"checkInFrom"`
	CheckInUntil  string `json:"checkInUntil"`
	CheckOutFrom  string `json:"checkOutFrom"`
	CheckOutUntil string `json:"checkOutUntil"`

	CountryCode string `json:"countryCode"`
	City        string `json:"city"`
	Area        string `json:"area"`
	ZipCode     string `json:"zipCode"`

	AvgRating   float64 `json:"avgRating"`
	ReviewCount uint32  `json:"reviewCount"`

	About      string     `json:"about"`
	Highlights Highlights `json:"highlights"`
	AreaInfo   AreaInfo   `json:"areaInfo"`

	Rules     Rules  `json:"rules"`
	FinePrint string `json:"finePrint"`

	Reviews []review `json:"reviews"`

	Images     []image         `json:"images"`
	Facilities []facilityGroup `json:"facilities"`

	Rooms []roomAvailability `json:"rooms"`
}

type review struct {
	ID          string `json:"id"`
	DisplayName string `json:"displayName"`
	CountryCode string `json:"countryCode"`
	Comment     string `json:"comment"`
}

type image struct {
	ID          string `json:"id"`
	URL         string `json:"url"`
	Position    int    `json:"position"`
	Orientation string `json:"orientation"`
}

type facilityGroup struct {
	Category string   `json:"category"`
	Items    []string `json:"items"`
}

type roomAvailability struct {
	RoomID uuid.UUID `json:"roomId"`
	Name   string    `json:"name"`

	BedInfo string `json:"bedInfo"`

	Facilities []string   `json:"facilities"`
	RatePlans  []ratePlan `json:"ratePlans"`

	AvailableRooms uint8 `json:"availableRooms"`
}

type ratePlan struct {
	ID                uuid.UUID `json:"id"`
	Name              string    `json:"name"`
	MaxGuest          uint8     `json:"maxGuest"`
	Price             float64   `json:"price"`
	Refundable        bool      `json:"refundable"`
	BreakfastIncluded bool      `json:"breakfastIncluded"`
}

// FromDomainModel converts a domain PropertyDetail model into a PropertyDetailResponse suitable for API responses.
func (r *DetailResponse) FromDomainModel(
	model *Detail,
) *DetailResponse {
	if model == nil {
		return nil
	}

	reviews := make([]review, len(model.Reviews))
	for i, rev := range model.Reviews {
		reviews[i] = review(rev)
	}

	images := make([]image, len(model.Images))
	for i, img := range model.Images {
		images[i] = image{
			ID:          img.ID,
			URL:         img.ImageUrl,
			Position:    int(img.Position),
			Orientation: img.Orientation,
		}
	}

	facilityGroups := make([]facilityGroup, len(model.Facilities))
	for i, fg := range model.Facilities {
		facilityGroups[i] = facilityGroup(fg)
	}

	roomAvailabilities := make([]roomAvailability, len(model.Rooms))
	for i, room := range model.Rooms {
		ratePlans := make([]ratePlan, len(room.RatePlans))
		for j, rp := range room.RatePlans {
			ratePlans[j] = ratePlan(rp)
		}

		roomAvailabilities[i] = roomAvailability{
			RoomID:         room.RoomId,
			Name:           room.Name,
			BedInfo:        room.BedInfo,
			Facilities:     room.Facilities,
			RatePlans:      ratePlans,
			AvailableRooms: room.AvailableRooms,
		}
	}

	return &DetailResponse{
		ID:            model.ID,
		Name:          model.Name,
		Slug:          model.Slug,
		Type:          model.Type,
		CheckInFrom:   model.CheckInFrom.Format("15:04"),
		CheckInUntil:  model.CheckInUntil.Format("15:04"),
		CheckOutFrom:  model.CheckOutFrom.Format("15:04"),
		CheckOutUntil: model.CheckOutUntil.Format("15:04"),
		CountryCode:   model.CountryCode,
		City:          model.City,
		Area:          model.Area,
		ZipCode:       model.ZipCode,
		AvgRating:     model.AvgRating,
		ReviewCount:   model.ReviewCount,
		About:         model.About,
		Highlights:    model.Highlights,
		AreaInfo:      model.AreaInfo,
		Rules:         model.Rules,
		FinePrint:     model.FinePrint,
		Reviews:       reviews,
		Images:        images,
		Facilities:    facilityGroups,
		Rooms:         roomAvailabilities,
	}
}

// SearchPropertyResponse defines the structure of each property in the response for the SearchProperties endpoint.
type SearchPropertyResponse struct {
	Id            string       `json:"id"`
	Slug          string       `json:"slug"`
	Name          string       `json:"name"`
	CountryCode   string       `json:"countryCode"`
	City          string       `json:"city"`
	Area          string       `json:"area"`
	AvgRating     float64      `json:"avgRating"`
	ReviewCount   uint32       `json:"reviewCount"`
	StartingPrice float64      `json:"startingPrice"`
	Room          roomResponse `json:"room"`
	Image         *string      `json:"image"`
}

type roomResponse struct {
	Name              string         `json:"name"`
	Beds              []bedsResponse `json:"beds"`
	BreakfastIncluded bool           `json:"breakfastIncluded"`
}

type bedsResponse struct {
	Type     string `json:"type"`
	Quantity uint8  `json:"quantity"`
}

// ExchangeRateResponse defines the exchange rate details including multiplier and precision digits.
type ExchangeRateResponse struct {
	ExchangeRate float64 `json:"exchangeRate"`
	Precision    uint8   `json:"precision"`
}

// CreatePropertyResponse defines the structure of the response returned after successfully creating a property.
type CreatePropertyResponse struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	Type     Type   `json:"type"`
	Timezone string `json:"timezone"`
}

// ReserveResponse defines the structure of the response returned when a property reservation is created.
type ReserveResponse struct {
	ReservationID uuid.UUID          `json:"reservationId"`
	PropertyID    uuid.UUID          `json:"propertyId"`
	ExpiresAt     time.Time          `json:"expiresAt"`
	TotalUSD      decimal.Decimal    `json:"totalUsd"`
	TotalLocal    decimal.Decimal    `json:"totalLocal"`
	ExchangeRate  decimal.Decimal    `json:"exchangeRate"`
	ReservedRooms []ReservedRoomItem `json:"reservedRooms"`
}

// ReservedRoomItem defines the pricing and identifier breakdown for each reserved room in a reservation response.
type ReservedRoomItem struct {
	RoomTypeID       uuid.UUID       `json:"roomTypeId"`
	RoomName         string          `json:"roomName"`
	RatePlanID       uuid.UUID       `json:"ratePlanId"`
	Quantity         uint8           `json:"quantity"`
	PricePerNightUSD decimal.Decimal `json:"pricePerNightUsd"`
}

// FromDomain converts a domain ReserveResponse model into an API ReserveResponse suitable for responses.
func (dt *ReserveResponse) FromDomain(d *ReserveResponse) *ReserveResponse {
	reservedRooms := make([]ReservedRoomItem, len(d.ReservedRooms))
	for i, room := range d.ReservedRooms {
		reservedRooms[i] = ReservedRoomItem{
			RoomTypeID:       room.RoomTypeID,
			RoomName:         room.RoomName,
			RatePlanID:       room.RatePlanID,
			Quantity:         room.Quantity,
			PricePerNightUSD: room.PricePerNightUSD,
		}
	}

	return &ReserveResponse{
		ReservationID: d.ReservationID,
		PropertyID:    d.PropertyID,
		ExpiresAt:     d.ExpiresAt,
		TotalUSD:      d.TotalUSD,
		TotalLocal:    d.TotalLocal,
		ExchangeRate:  d.ExchangeRate,
		ReservedRooms: reservedRooms,
	}
}

// GenerateImageUploadURLsResponse defines the structure of the response returned after generating presigned URLs for image uploads.
type GenerateImageUploadURLsResponse struct {
	Uploads []ImageUploadURLsResponse `json:"uploads"`
}

// ImageUploadURLsResponse defines the structure of each individual image upload URL response, including the presigned URL and the final image URL after upload.
type ImageUploadURLsResponse struct {
	Id        string `json:"id"`
	Key       string `json:"key"`
	UploadUrl string `json:"uploadUrl"`
	ImageUrl  string `json:"imageUrl"`
}

// FromDomainModel converts a slice of ImageUpload to a GenerateImageUploadURLsResponse, mapping the relevant fields for the API response.
func (r GenerateImageUploadURLsResponse) FromDomainModel(
	uploads []ImageUpload,
) *GenerateImageUploadURLsResponse {
	uploadResponses := make([]ImageUploadURLsResponse, len(uploads))

	for i, upload := range uploads {
		uploadResponses[i] = ImageUploadURLsResponse{
			Id:        upload.ID,
			Key:       upload.Key,
			UploadUrl: upload.UploadURL,
			ImageUrl:  upload.ImageURL,
		}
	}

	return &GenerateImageUploadURLsResponse{Uploads: uploadResponses}
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
