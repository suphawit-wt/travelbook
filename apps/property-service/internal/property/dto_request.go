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
