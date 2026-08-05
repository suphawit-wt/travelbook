// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"
	"fmt"

	gocql "github.com/apache/cassandra-gocql-driver/v2"
)

// Repository defines the data access contract for user entities.
type Repository interface {
	Create(ctx context.Context, review *Review) error
}

type repositoryDB struct {
	casSess *gocql.Session
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(casSess *gocql.Session) Repository {
	return &repositoryDB{casSess: casSess}
}

func (r *repositoryDB) Create(ctx context.Context, review *Review) error {
	batch := r.casSess.Batch(gocql.LoggedBatch)

	casQueryProp := `
		INSERT INTO reviews_by_property (
			property_id, created_at, review_id, booking_id, user_id, user_display_name, user_country_code,
			rating, staff, cleanliness, facilities, comfort, value_score, location, wifi,
			comment, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	batch.Query(
		casQueryProp,
		review.PropertyID,
		review.CreatedAt,
		review.ReviewID,
		review.BookingID,
		review.UserID,
		review.UserDisplayName,
		review.UserCountryCode,
		review.Rating,
		review.Staff,
		review.Cleanliness,
		review.Facilities,
		review.Comfort,
		review.ValueScore,
		review.Location,
		review.Wifi,
		review.Comment,
		review.UpdatedAt,
	)

	casQueryUser := `
		INSERT INTO reviews_by_user (
			user_id, user_display_name, user_country_code, created_at, review_id, property_id, booking_id,
			rating, staff, cleanliness, facilities, comfort, value_score, location, wifi,
			comment, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	batch.Query(
		casQueryUser,
		review.UserID,
		review.UserDisplayName,
		review.UserCountryCode,
		review.CreatedAt,
		review.ReviewID,
		review.PropertyID,
		review.BookingID,
		review.Rating,
		review.Staff,
		review.Cleanliness,
		review.Facilities,
		review.Comfort,
		review.ValueScore,
		review.Location,
		review.Wifi,
		review.Comment,
		review.UpdatedAt,
	)

	if err := batch.ExecContext(ctx); err != nil {
		return fmt.Errorf("cassandra batch insert failed: %w", err)
	}

	return nil
}
