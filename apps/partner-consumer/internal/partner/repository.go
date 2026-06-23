// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package partner

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for partner entities.
type Repository interface {
	Create(ctx context.Context, partner *Partner) (*Partner, error)
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(db *pgxpool.Pool) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) Create(
	ctx context.Context,
	partner *Partner,
) (*Partner, error) {
	query := `INSERT INTO partners
	(id, first_name, last_name, phone_number)
	VALUES ($1, $2, $3, $4)`

	_, err := r.db.Exec(
		ctx,
		query,
		partner.ID,
		partner.FirstName,
		partner.LastName,
		partner.PhoneNumber,
	)
	if err != nil {
		return nil, err
	}

	return &Partner{
		ID:          partner.ID,
		FirstName:   partner.FirstName,
		LastName:    partner.LastName,
		PhoneNumber: partner.PhoneNumber,
	}, nil
}
