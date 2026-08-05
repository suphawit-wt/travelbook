// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"
	"crypto/rand"
	"fmt"
	"math/big"

	gocql "github.com/apache/cassandra-gocql-driver/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for review entities.
type Repository interface {
	GetReviewsByPropertyID(ctx context.Context, propertyID uuid.UUID, limit int) ([]Review, error)
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

func (r *repositoryDB) GetReviewsByPropertyID(
	ctx context.Context,
	propertyID uuid.UUID,
	limit int,
) ([]Review, error) {
	gocqlPropertyID, err := gocql.UUIDFromBytes(propertyID[:])
	if err != nil {
		return nil, fmt.Errorf("invalid property uuid: %w", err)
	}

	query := `
		SELECT property_id, created_at, review_id, user_id, booking_id,
		       user_display_name, user_country_code, rating, staff, 
		       cleanliness, facilities, comfort, value_score, location, wifi, 
		       comment, updated_at
		FROM reviews_by_property
		WHERE property_id = ?
		LIMIT 50
	`

	iter := r.casSess.Query(query, gocqlPropertyID).IterContext(ctx)

	var candidates []Review
	var row Cassandra

	for iter.Scan(
		&row.PropertyID, &row.CreatedAt, &row.ReviewID, &row.UserID, &row.BookingID,
		&row.UserDisplayName, &row.UserCountryCode, &row.Rating, &row.Staff,
		&row.Cleanliness, &row.Facilities, &row.Comfort, &row.ValueScore, &row.Location, &row.Wifi,
		&row.Comment, &row.UpdatedAt,
	) {
		if isCompleteReview(&row) {
			item := row.ToDomain()
			candidates = append(candidates, *item)
		}
	}

	if err := iter.Close(); err != nil {
		return nil, err
	}

	if len(candidates) == 0 {
		return []Review{}, nil
	}

	for i := len(candidates) - 1; i > 0; i-- {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		if err != nil {
			return nil, err
		}
		j := n.Int64()
		candidates[i], candidates[j] = candidates[j], candidates[i]
	}

	if len(candidates) < limit {
		return candidates, nil
	}

	return candidates[:limit], nil
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

func isCompleteReview(r *Cassandra) bool {
	hasComment := r.Comment != nil && *r.Comment != ""
	hasDisplayName := r.UserDisplayName != nil && *r.UserDisplayName != ""
	hasCountryCode := r.UserCountryCode != nil && *r.UserCountryCode != ""

	return hasComment && hasDisplayName && hasCountryCode
}
