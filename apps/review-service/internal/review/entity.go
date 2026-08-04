// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"time"

	gocql "github.com/apache/cassandra-gocql-driver/v2"
	"github.com/google/uuid"
)

// Review represents the core domain model entity for a property review.
type Review struct {
	ID              uuid.UUID
	PropertyID      uuid.UUID
	BookingID       uuid.UUID
	UserID          uuid.UUID
	UserDisplayName *string
	UserCountryCode *string
	Rating          int16
	SubRatings      SubRatings
	Comment         *string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// Postgres represents the PostgreSQL system-of-record entity.
type Postgres struct {
	ID              uuid.UUID `db:"id"`
	PropertyID      uuid.UUID `db:"property_id"`
	BookingID       uuid.UUID `db:"booking_id"`
	UserID          uuid.UUID `db:"user_id"`
	UserDisplayName *string   `db:"user_display_name"`
	UserCountryCode *string   `db:"user_country_code"`
	Rating          int16     `db:"rating"`
	Staff           *int16    `db:"staff"`
	Cleanliness     *int16    `db:"cleanliness"`
	Facilities      *int16    `db:"facilities"`
	Comfort         *int16    `db:"comfort"`
	Value           *int16    `db:"value"`
	Location        *int16    `db:"location"`
	Wifi            *int16    `db:"wifi"`
	Comment         *string   `db:"comment"`
	CreatedAt       time.Time `db:"created_at"`
	UpdatedAt       time.Time `db:"updated_at"`
}

// FromDomain converts a domain Review entity to a Postgres entity.
func (r *Postgres) FromDomain(d *Review) Postgres {
	return Postgres{
		ID:              d.ID,
		PropertyID:      d.PropertyID,
		BookingID:       d.BookingID,
		UserID:          d.UserID,
		UserDisplayName: d.UserDisplayName,
		UserCountryCode: d.UserCountryCode,
		Rating:          d.Rating,
		Staff:           d.SubRatings.Staff,
		Cleanliness:     d.SubRatings.Cleanliness,
		Facilities:      d.SubRatings.Facilities,
		Comfort:         d.SubRatings.Comfort,
		Value:           d.SubRatings.Value,
		Location:        d.SubRatings.Location,
		Wifi:            d.SubRatings.Wifi,
		Comment:         d.Comment,
		CreatedAt:       d.CreatedAt,
		UpdatedAt:       d.UpdatedAt,
	}
}

// Cassandra represents the denormalized read-model entity.
type Cassandra struct {
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

// FromDomain converts a domain Review entity into a Cassandra entity pointer.
func (r *Cassandra) FromDomain(d *Review) *Cassandra {
	if d == nil {
		return nil
	}

	toGocqlUUID := func(id uuid.UUID) gocql.UUID {
		gUUID, _ := gocql.UUIDFromBytes(id[:])
		return gUUID
	}

	return &Cassandra{
		PropertyID:      toGocqlUUID(d.PropertyID),
		ReviewID:        toGocqlUUID(d.ID),
		BookingID:       toGocqlUUID(d.BookingID),
		UserID:          toGocqlUUID(d.UserID),
		UserDisplayName: d.UserDisplayName,
		UserCountryCode: d.UserCountryCode,
		Rating:          d.Rating,
		Staff:           d.SubRatings.Staff,
		Cleanliness:     d.SubRatings.Cleanliness,
		Facilities:      d.SubRatings.Facilities,
		Comfort:         d.SubRatings.Comfort,
		ValueScore:      d.SubRatings.Value,
		Location:        d.SubRatings.Location,
		Wifi:            d.SubRatings.Wifi,
		Comment:         d.Comment,
		CreatedAt:       d.CreatedAt,
		UpdatedAt:       d.UpdatedAt,
	}
}

// ToDomain converts a Cassandra entity pointer into a domain Review entity pointer.
func (r *Cassandra) ToDomain() *Review {
	if r == nil {
		return nil
	}

	return &Review{
		ID:              uuid.UUID(r.ReviewID),
		PropertyID:      uuid.UUID(r.PropertyID),
		BookingID:       uuid.UUID(r.BookingID),
		UserID:          uuid.UUID(r.UserID),
		UserDisplayName: r.UserDisplayName,
		UserCountryCode: r.UserCountryCode,
		Rating:          r.Rating,
		SubRatings: SubRatings{
			Staff:       r.Staff,
			Cleanliness: r.Cleanliness,
			Facilities:  r.Facilities,
			Comfort:     r.Comfort,
			Value:       r.ValueScore,
			Location:    r.Location,
			Wifi:        r.Wifi,
		},
		Comment:   r.Comment,
		CreatedAt: r.CreatedAt,
		UpdatedAt: r.UpdatedAt,
	}
}
