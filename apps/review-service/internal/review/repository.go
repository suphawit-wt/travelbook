// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"
	"fmt"

	gocql "github.com/apache/cassandra-gocql-driver/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for review entities.
type Repository interface {
	Create(ctx context.Context, tx pgx.Tx, review *Review) (*Review, error)
}

type repositoryDB struct {
	db      *pgxpool.Pool
	casSess *gocql.Session
}

// NewReposityDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewReposityDB(db *pgxpool.Pool, casSess *gocql.Session) Repository {
	return &repositoryDB{db: db, casSess: casSess}
}

func (r *repositoryDB) Create(
	ctx context.Context,
	tx pgx.Tx,
	review *Review,
) (*Review, error) {
	var postgresModel Postgres
	model := postgresModel.FromDomain(review)

	query := `
		INSERT INTO reviews (
			id, property_id, booking_id, user_id, user_display_name, user_country_code, rating,
			staff, cleanliness, facilities, comfort, value, location, wifi,
			comment, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9, $10, $11, $12,
			$13, $14, $15, $16, $17
		)
	`

	_, err := tx.Exec(
		ctx,
		query,
		model.ID,
		model.PropertyID,
		model.BookingID,
		model.UserID,
		model.UserDisplayName,
		model.UserCountryCode,
		model.Rating,
		model.Staff,
		model.Cleanliness,
		model.Facilities,
		model.Comfort,
		model.Value,
		model.Location,
		model.Wifi,
		model.Comment,
		model.CreatedAt,
		model.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("postgres insert review failed: %w", err)
	}

	return review, nil
}
