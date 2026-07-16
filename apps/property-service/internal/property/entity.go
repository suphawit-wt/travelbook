// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"time"

	"github.com/google/uuid"
)

// Property represents the main entity for a property in the system.
type Property struct {
	ID            uuid.UUID `db:"id"`
	Name          string    `db:"name"`
	Slug          string    `db:"slug"`
	Type          Type      `db:"type"`
	Status        Status    `db:"status"`
	Timezone      string    `db:"timezone"`
	CheckInFrom   time.Time `db:"check_in_from"`
	CheckInUntil  time.Time `db:"check_in_until"`
	CheckOutFrom  time.Time `db:"check_out_from"`
	CheckOutUntil time.Time `db:"check_out_until"`

	AvgRating   float64 `db:"avg_rating"`
	ReviewCount uint32  `db:"review_count"`

	CountryCode  *string  `db:"country_code"`
	Province     *string  `db:"province"`
	City         *string  `db:"city"`
	Area         *string  `db:"area"`
	AddressLine1 *string  `db:"address_line1"`
	AddressLine2 *string  `db:"address_line2"`
	ZipCode      *string  `db:"zip_code"`
	Latitude     *float64 `db:"latitude"`
	Longitude    *float64 `db:"longitude"`

	About      *string     `db:"about"`
	Highlights *Highlights `db:"highlights"`
	AreaInfo   *AreaInfo   `db:"area_info"`

	Rules     Rules   `db:"rules"`
	FinePrint *string `db:"fine_print"`

	PartnerID     uuid.UUID `db:"partner_id"`
	CoverImageURL *string   `db:"cover_image_url"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

// Highlights represents the key features or selling points of a property, such as room types and breakfast options.
type Highlights struct {
	RoomsWith     []string `json:"roomsWith"`
	BreakfastInfo []string `json:"breakfastInfo"`
}

// AreaInfo represents information about the area surrounding a property.
type AreaInfo struct {
	NearbyPlaces    []AreaItem `json:"nearbyPlaces"`
	RestaurantsCafe []AreaItem `json:"restaurantsCafe"`
	TopAttractions  []AreaItem `json:"topAttractions"`
	NaturalBeauty   []AreaItem `json:"naturalBeauty"`
	Beaches         []AreaItem `json:"beaches"`
	PublicTransit   []AreaItem `json:"publicTransit"`
	ClosestAirports []AreaItem `json:"closestAirports"`
}

// AreaItem represents a single item of area information, such as a nearby place or attraction.
type AreaItem struct {
	Name      string    `json:"name"`
	Type      *AreaType `json:"type"`
	DistanceM float64   `json:"distanceM"`
}

// Rules encapsulates the various policies and requirements associated with a property.
type Rules struct {
	DamageDeposit           DamageDeposit           `json:"damageDeposit"`
	ChildPolicies           ChildPolicies           `json:"childPolicies"`
	CribAndExtraBedPolicies CribAndExtraBedPolicies `json:"cribAndExtraBedPolicies"`

	MinCheckInAge uint16 `json:"minCheckInAge"`

	PetsAllowed     bool     `json:"petsAllowed"`
	PartiesAllowed  bool     `json:"partiesAllowed"`
	AcceptedPayment []string `json:"acceptedPayment"`
}

// ChildPolicies defines the rules regarding children staying at the property, including age restrictions and whether they are charged as adults.
type ChildPolicies struct {
	Allowed            bool    `json:"allowed"`
	MinAgeAllowed      *uint16 `json:"minAgeAllowed"`
	ChargedAsAdultsAge *uint16 `json:"chargedAsAdultsAge"`
}

// CribAndExtraBedPolicies defines the policies for providing cribs and extra beds, including age ranges, whether they are free, and any associated costs.
type CribAndExtraBedPolicies struct {
	Crib     BedPolicy `json:"crib"`
	ExtraBed BedPolicy `json:"extraBed"`
}

// BedPolicy defines the policy for either a crib or an extra bed, including the age range of guests it applies to, whether it is free, and any associated price.
type BedPolicy struct {
	AgeRange AgeRange `json:"ageRange"`
	Free     bool     `json:"free"`
	Price    *Money   `json:"price"`
}

// AgeRange defines a range of ages, with a minimum age and an optional maximum age.
type AgeRange struct {
	Min uint16  `json:"min"`
	Max *uint16 `json:"max"`
}

// Money represents a monetary amount along with its currency, used for pricing and fees associated with property rules.
type Money struct {
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
}

// DamageDeposit defines the policy for damage deposits, including whether a deposit is required and the amount if it is required.
type DamageDeposit struct {
	Required bool     `json:"required"`
	Price    *float64 `json:"price"`
}
