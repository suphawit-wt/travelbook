// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"time"

	gocql "github.com/apache/cassandra-gocql-driver/v2"
)

// Review represents the denormalized read-model entity.
type Review struct {
	PropertyID      gocql.UUID `cql:"property_id"       json:"propertyId"`
	ReviewID        gocql.UUID `cql:"review_id"         json:"reviewId"`
	BookingID       gocql.UUID `cql:"booking_id"        json:"bookingId"`
	UserID          gocql.UUID `cql:"user_id"           json:"userId"`
	UserDisplayName *string    `cql:"user_display_name" json:"userDisplayName"`
	UserCountryCode *string    `cql:"user_country_code" json:"userCountryCode"`
	Rating          int16      `cql:"rating"            json:"rating"`
	Staff           *int16     `cql:"staff"             json:"staff"`
	Cleanliness     *int16     `cql:"cleanliness"       json:"cleanliness"`
	Facilities      *int16     `cql:"facilities"        json:"facilities"`
	Comfort         *int16     `cql:"comfort"           json:"comfort"`
	ValueScore      *int16     `cql:"value_score"       json:"valueScore"`
	Location        *int16     `cql:"location"          json:"location"`
	Wifi            *int16     `cql:"wifi"              json:"wifi"`
	Comment         *string    `cql:"comment"           json:"comment"`
	CreatedAt       time.Time  `cql:"created_at"        json:"createdAt"`
	UpdatedAt       time.Time  `cql:"updated_at"        json:"updatedAt"`
}
