// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

// Repository defines the data access contract for property entities.
type Repository interface {
	Create(ctx context.Context, tx pgx.Tx, p *Property) (*Property, error)
}

type repositoryDB struct {
	db  *pgxpool.Pool
	rdb *redis.Client
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(
	db *pgxpool.Pool,
	rdb *redis.Client,
) Repository {
	return &repositoryDB{db: db, rdb: rdb}
}

func (r *repositoryDB) Create(
	ctx context.Context,
	tx pgx.Tx,
	p *Property,
) (*Property, error) {
	propertyQuery := `
	INSERT INTO properties (
		id,
		name,
		slug,
		type,
		timezone,
		check_in_from,
		check_in_until,
		check_out_from,
		check_out_until,
		partner_id
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`

	_, err := tx.Exec(
		ctx,
		propertyQuery,
		p.ID,
		p.Name,
		p.Slug,
		p.Type,
		p.Timezone,
		p.CheckInFrom,
		p.CheckInUntil,
		p.CheckOutFrom,
		p.CheckOutUntil,
		p.PartnerID,
	)
	if err != nil {
		return nil, err
	}

	return p, nil
}
