// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for user entities.
type Repository interface {
	Create(ctx context.Context, user *User) (*User, error)
	CreateFromOAuth(ctx context.Context, user *User) (*User, error)
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of repositoryDB with the provided database connection pool.
func NewRepositoryDB(db *pgxpool.Pool) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) Create(ctx context.Context, user *User) (*User, error) {
	query := "INSERT INTO users (id) VALUES ($1)"

	_, err := r.db.Exec(ctx, query, user.ID)
	if err != nil {
		return nil, err
	}

	return &User{ID: user.ID}, nil
}

func (r *repositoryDB) CreateFromOAuth(
	ctx context.Context,
	user *User,
) (*User, error) {
	query := "INSERT INTO users (id, display_name, avatar_url) VALUES ($1, $2, $3)"

	_, err := r.db.Exec(ctx, query, user.ID, user.DisplayName, user.AvatarURL)
	if err != nil {
		return nil, err
	}

	return &User{ID: user.ID}, nil
}
