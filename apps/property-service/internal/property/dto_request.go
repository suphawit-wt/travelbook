// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"time"

	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

// GetPropertySlugURI defines the URI parameters for the GetPropertyBySlug endpoint.
type GetPropertySlugURI struct {
	Slug string `uri:"slug" binding:"required"`
}

// GetPropertyBySlugRequest defines the query parameters for the GetPropertyBySlug endpoint.
type GetPropertyBySlugRequest struct {
	CheckIn  string `form:"checkin"  binding:"required"`
	CheckOut string `form:"checkout" binding:"required"`
	Adults   uint8  `form:"adults"   binding:"required,gte=1"`
	Children uint8  `form:"children" binding:"gte=0"`
	Room     uint8  `form:"room"     binding:"required,gte=1"`
}

// SearchPropertiesRequest defines the query parameters for the SearchProperties endpoint.
type SearchPropertiesRequest struct {
	Destination string `form:"dest"     binding:"required"`
	CheckIn     string `form:"checkin"  binding:"required"`
	CheckOut    string `form:"checkout" binding:"required"`
	Adults      uint8  `form:"adults"   binding:"required,gte=1,lte=30"`
	Children    uint8  `form:"children" binding:"gte=0,lte=10"`
	Room        uint8  `form:"room"     binding:"required,gte=1,lte=30"`
	Page        int    `form:"page"`
	PerPage     int    `form:"per_page"`
}

// FromDomainModel converts a slice of domain SearchProperty models into a slice of SearchPropertyResponse suitable for API responses.
func (r *SearchPropertyResponse) FromDomainModel(
	model []SearchProperty,
) []SearchPropertyResponse {
	responses := make([]SearchPropertyResponse, len(model))
	for i := range model {
		beds := make([]bedsResponse, len(model[i].Room.Beds))
		for j, bed := range model[i].Room.Beds {
			beds[j] = bedsResponse(bed)
		}

		responses[i] = SearchPropertyResponse{
			Id:            model[i].Id,
			Slug:          model[i].Slug,
			Name:          model[i].Name,
			CountryCode:   model[i].CountryCode,
			City:          model[i].City,
			Area:          model[i].Area,
			AvgRating:     model[i].AvgRating,
			ReviewCount:   model[i].ReviewCount,
			StartingPrice: model[i].StartingPrice,
			Image:         model[i].Image,
			Room: roomResponse{
				Name:              model[i].Room.Name,
				Beds:              beds,
				BreakfastIncluded: model[i].Room.BreakfastIncluded,
			},
		}
	}
	return responses
}

// URI defines the expected URI parameters for property-related endpoints.
type URI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// RoomURI represents the URI parameters for room-related endpoints, specifically the room ID.
type RoomURI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// GetExchangeRateURI defines the URI parameters for retrieving exchange rates by currency code.
type GetExchangeRateURI struct {
	CurrencyCode string `uri:"currency" binding:"required,iso4217"`
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

// CreatePropertyImagesRequest defines the expected payload for creating new images for a property.
type CreatePropertyImagesRequest struct {
	Images []ImageUploadRequst `json:"images" binding:"required"`
}

// ImageUploadRequst defines the expected metadata for each image in the CreatePropertyImagesRequest.
type ImageUploadRequst struct {
	Id          string `json:"id"          binding:"required,uuid"`
	Key         string `json:"key"         binding:"required"`
	ImageUrl    string `json:"imageUrl"    binding:"required"`
	Position    uint8  `json:"position"    binding:"required,gte=0"`
	Orientation string `json:"orientation" binding:"required,eq=landscape|eq=portrait"`
}

// ToDomainModel converts the CreatePropertyImagesRequest into a slice of PropertyImage, preparing it for use in the domain layer.
func (r *CreatePropertyImagesRequest) ToDomainModel() []Image {
	images := make([]Image, len(r.Images))
	for i, img := range r.Images {
		images[i] = Image{
			ID:          img.Id,
			Key:         img.Key,
			ImageUrl:    img.ImageUrl,
			Position:    img.Position,
			Orientation: img.Orientation,
		}
	}

	return images
}

// CreatePropertyRoomRequest defines the expected payload for creating a new room within a property.
type CreatePropertyRoomRequest struct {
	Name           string       `json:"name"           binding:"required"`
	MaxAdults      uint8        `json:"maxAdults"      binding:"required,gt=0"`
	MaxChildren    uint8        `json:"maxChildren"    binding:"required,gte=0"`
	BasePriceCents int64        `json:"basePriceCents" binding:"required,gte=0"`
	TotalRooms     uint8        `json:"totalRooms"     binding:"required,gt=0"`
	Beds           []bedRequest `json:"beds"           binding:"required"`
}

type bedRequest struct {
	BedType  string `json:"bedType"  binding:"required"`
	Quantity uint8  `json:"quantity" binding:"required,gt=0"`
}

// ToDomainModel converts the CreatePropertyRoomRequest into a CreatePropertyRoom.
func (r *CreatePropertyRoomRequest) ToDomainModel() *CreatePropertyRoom {
	return &CreatePropertyRoom{
		Name:           r.Name,
		MaxAdults:      r.MaxAdults,
		MaxChildren:    r.MaxChildren,
		BasePriceCents: r.BasePriceCents,
		TotalRooms:     r.TotalRooms,
		Beds:           r.toDomainBeds(),
	}
}

func (r *CreatePropertyRoomRequest) toDomainBeds() []CreateBed {
	beds := make([]CreateBed, len(r.Beds))
	for i, b := range r.Beds {
		beds[i] = CreateBed(b)
	}

	return beds
}

// CreateRatePlanRequest represents the request body for creating a new rate plan for a room.
type CreateRatePlanRequest struct {
	Name              string  `json:"name"              binding:"required,lte=20"`
	PriceModifier     float64 `json:"priceModifier"     binding:"required"`
	Refundable        bool    `json:"refundable"`
	BreakfastIncluded bool    `json:"breakfastIncluded"`
}

// ReservePropertyRequest defines the expected payload for reserve a property.
type ReservePropertyRequest struct {
	CheckIn  time.Time     `json:"checkIn"  binding:"required"`
	CheckOut time.Time     `json:"checkOut" binding:"required"`
	Nights   uint8         `json:"nights"   binding:"required,gte=1"`
	Rooms    []roomRequest `json:"rooms"    binding:"required,dive"`
	Guests   guestRequest  `json:"guests"   binding:"required"`
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

// ToDomain converts a ReservePropertyRequest into a domain ReserveRequest.
func (r *ReservePropertyRequest) ToDomain(
	propertyIdStr string,
	currencyCode string,
) (*ReserveRequest, error) {
	propertyID, err := uuid.Parse(propertyIdStr)
	if err != nil {
		return nil, errs.NewBadRequestError("Invalid property ID format.")
	}

	rooms := make([]RoomRequestItem, len(r.Rooms))
	for i, room := range r.Rooms {
		roomTypeID, err := uuid.Parse(room.RoomTypeID)
		if err != nil {
			return nil, errs.NewBadRequestError("RatePlanID type")
		}

		ratePlanID, err := uuid.Parse(room.RatePlanID)
		if err != nil {
			return nil, errs.NewBadRequestError("RatePlanID type")
		}

		rooms[i] = RoomRequestItem{
			RoomTypeID: roomTypeID,
			RatePlanID: ratePlanID,
			Quantity:   room.Quantity,
		}
	}

	return &ReserveRequest{
		PropertyID:   propertyID,
		CurrencyCode: currencyCode,
		CheckIn:      r.CheckIn,
		CheckOut:     r.CheckOut,
		Nights:       r.Nights,
		Rooms:        rooms,
		Guests:       GuestRequest(r.Guests),
	}, nil
}

// ReleasePropertyRequest defines the payload required for releasing reserved property rooms.
type ReleasePropertyRequest struct {
	PropertyID string        `json:"propertyId"`
	CheckIn    time.Time     `json:"checkIn"`
	CheckOut   time.Time     `json:"checkOut"`
	Rooms      []ReleaseRoom `json:"rooms"`
}

// ReleaseRoom represents the individual room and quantity to be released in a release request.
type ReleaseRoom struct {
	RoomTypeID string `json:"roomTypeId"`
	Quantity   int    `json:"quantity"`
}

// ToDomain converts a ReleasePropertyRequest into a domain ReleaseProperty model.
func (r *ReleasePropertyRequest) ToDomain() (*ReleaseProperty, error) {
	propertyID, err := uuid.Parse(r.PropertyID)
	if err != nil {
		return nil, err
	}

	rooms := make([]ReleaseRoom, len(r.Rooms))
	for i, room := range r.Rooms {
		roomTypeID, err := uuid.Parse(room.RoomTypeID)
		if err != nil {
			return nil, err
		}

		rooms[i] = ReleaseRoom{
			RoomTypeID: roomTypeID.String(),
			Quantity:   room.Quantity,
		}
	}

	return &ReleaseProperty{
		PropertyID: propertyID,
		CheckIn:    r.CheckIn,
		CheckOut:   r.CheckOut,
		Rooms:      rooms,
	}, nil
}

// GenerateImageUploadURLsRequest defines the expected payload for generating presigned URLs for image uploads.
type GenerateImageUploadURLsRequest struct {
	Files []FileMetadataRequest `json:"files" binding:"required"`
}

// FileMetadataRequest defines the expected metadata for each file in the GenerateImageUploadURLsRequest.
type FileMetadataRequest struct {
	FileName    string `json:"fileName"    binding:"required"`
	ContentType string `json:"contentType" binding:"required"`
	Size        uint32 `json:"size"        binding:"required,gt=0"`
}

// ToDomain converts the GenerateImageUploadURLsRequest into a slice of FileMetadata, preparing it for use in the domain layer.
func (r *GenerateImageUploadURLsRequest) ToDomain() []FileMetadata {
	files := make([]FileMetadata, len(r.Files))
	for i, f := range r.Files {
		files[i] = FileMetadata(f)
	}

	return files
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

// UpdatePropertyDescriptionRequest defines the expected payload for updating a property's description, including the about section, highlights, and area information.
type UpdatePropertyDescriptionRequest struct {
	About    string          `json:"about"    binding:"required"`
	Hilights hilightsRequest `json:"hilights" binding:"required"`
	AreaInfo areaInfoRequest `json:"areaInfo" binding:"omitempty"`
}

type hilightsRequest struct {
	RoomsWith     []string `json:"roomsWith"     binding:"required"`
	BreakfastInfo []string `json:"breakfastInfo" binding:"omitempty"`
}

type areaInfoRequest struct {
	NearbyPlaces    []areaItemRequest `json:"nearbyPlaces"    binding:"omitempty"`
	RestaurantsCafe []areaItemRequest `json:"restaurantsCafe" binding:"omitempty"`
	TopAttractions  []areaItemRequest `json:"topAttractions"  binding:"omitempty"`
	NaturalBeauty   []areaItemRequest `json:"naturalBeauty"   binding:"omitempty"`
	Beaches         []areaItemRequest `json:"beaches"         binding:"omitempty"`
	PublicTransit   []areaItemRequest `json:"publicTransit"   binding:"omitempty"`
	ClosestAirports []areaItemRequest `json:"closestAirports" binding:"omitempty"`
}

type areaItemRequest struct {
	Name      string  `json:"name"      binding:"required"`
	Type      *Type   `json:"type"      binding:"omitempty,eq=cafeBar|eq=peak|eq=train|eq=bus"`
	DistanceM float64 `json:"distanceM" binding:"required"`
}

// ToDomain converts the UpdatePropertyDescriptionRequest into a PropertyDescription, preparing it for use in the domain layer.
func (r *UpdatePropertyDescriptionRequest) ToDomain() *Description {
	return &Description{
		About: r.About,
		Hilights: Hilights{
			RoomsWith:     r.Hilights.RoomsWith,
			BreakfastInfo: r.Hilights.BreakfastInfo,
		},
		AreaInfo: AreaInfo{
			NearbyPlaces:    toDomainAreaItems(r.AreaInfo.NearbyPlaces),
			RestaurantsCafe: toDomainAreaItems(r.AreaInfo.RestaurantsCafe),
			TopAttractions:  toDomainAreaItems(r.AreaInfo.TopAttractions),
			NaturalBeauty:   toDomainAreaItems(r.AreaInfo.NaturalBeauty),
			Beaches:         toDomainAreaItems(r.AreaInfo.Beaches),
			PublicTransit:   toDomainAreaItems(r.AreaInfo.PublicTransit),
			ClosestAirports: toDomainAreaItems(r.AreaInfo.ClosestAirports),
		},
	}
}

func toDomainAreaItems(items []areaItemRequest) []AreaItem {
	domainItems := make([]AreaItem, len(items))
	for i, item := range items {
		var areaType *AreaType
		if item.Type != nil {
			at := AreaType(*item.Type)
			areaType = &at
		}

		domainItems[i] = AreaItem{
			Name:      item.Name,
			Type:      areaType,
			DistanceM: item.DistanceM,
		}
	}

	return domainItems
}

// UpdatePropertyPoliciesRequest defines the expected payload for updating a property's policies, including rules and fine print.
type UpdatePropertyPoliciesRequest struct {
	Rules     rulesRequest `json:"rules"     binding:"required"`
	FinePrint string       `json:"finePrint" binding:"omitempty"`
}

type rulesRequest struct {
	DamageDeposit           damageDepositRequest           `json:"damageDeposit"           binding:"omitempty"`
	ChildPolicies           childPoliciesRequest           `json:"childPolicies"           binding:"required"`
	CribAndExtraBedPolicies cribAndExtraBedPoliciesRequest `json:"cribAndExtraBedPolicies" binding:"required"`

	MinCheckInAge uint16 `json:"minCheckInAge" binding:"required"`

	PetsAllowed     bool     `json:"petsAllowed"`
	PartiesAllowed  bool     `json:"partiesAllowed"`
	AcceptedPayment []string `json:"acceptedPayment" binding:"required"`
}

type childPoliciesRequest struct {
	Allowed            bool    `json:"allowed"`
	MinAgeAllowed      *uint16 `json:"minAgeAllowed"      binding:"omitempty"`
	ChargedAsAdultsAge *uint16 `json:"chargedAsAdultsAge" binding:"omitempty"`
}

type cribAndExtraBedPoliciesRequest struct {
	Crib     bedPolicyRequest `json:"crib"     binding:"required"`
	ExtraBed bedPolicyRequest `json:"extraBed" binding:"required"`
}

type bedPolicyRequest struct {
	AgeRange ageRangeRequest `json:"ageRange" binding:"required"`
	Free     bool            `json:"free"`
	Price    *moneyRequest   `json:"price"    binding:"omitempty"`
}

type ageRangeRequest struct {
	Min uint16  `json:"min" binding:"required"`
	Max *uint16 `json:"max" binding:"omitempty"`
}

type moneyRequest struct {
	Amount   float64 `json:"amount"   binding:"required"`
	Currency string  `json:"currency" binding:"required,iso4217"`
}

type damageDepositRequest struct {
	Required bool     `json:"required"`
	Price    *float64 `json:"price"    binding:"omitempty"`
}

// ToDomain converts the UpdatePropertyPoliciesRequest into a PropertyPolicies, preparing it for use in the domain layer.
func (r *UpdatePropertyPoliciesRequest) ToDomain() *Policies {
	return &Policies{
		Rules: Rules{
			DamageDeposit: DamageDeposit{
				Required: r.Rules.DamageDeposit.Required,
				Price:    r.Rules.DamageDeposit.Price,
			},
			ChildPolicies: ChildPolicies{
				Allowed:            r.Rules.ChildPolicies.Allowed,
				MinAgeAllowed:      r.Rules.ChildPolicies.MinAgeAllowed,
				ChargedAsAdultsAge: r.Rules.ChildPolicies.ChargedAsAdultsAge,
			},
			CribAndExtraBedPolicies: CribAndExtraBedPolicies{
				Crib: BedPolicy{
					AgeRange: AgeRange{
						Min: r.Rules.CribAndExtraBedPolicies.Crib.AgeRange.Min,
						Max: r.Rules.CribAndExtraBedPolicies.Crib.AgeRange.Max,
					},
					Free:  r.Rules.CribAndExtraBedPolicies.Crib.Free,
					Price: (*Money)(r.Rules.CribAndExtraBedPolicies.Crib.Price),
				},
				ExtraBed: BedPolicy{
					AgeRange: AgeRange{
						Min: r.Rules.CribAndExtraBedPolicies.ExtraBed.AgeRange.Min,
						Max: r.Rules.CribAndExtraBedPolicies.ExtraBed.AgeRange.Max,
					},
					Free:  r.Rules.CribAndExtraBedPolicies.ExtraBed.Free,
					Price: (*Money)(r.Rules.CribAndExtraBedPolicies.ExtraBed.Price),
				},
			},
			MinCheckInAge:   r.Rules.MinCheckInAge,
			PetsAllowed:     r.Rules.PetsAllowed,
			PartiesAllowed:  r.Rules.PartiesAllowed,
			AcceptedPayment: r.Rules.AcceptedPayment,
		},
		FinePrint: &r.FinePrint,
	}
}
