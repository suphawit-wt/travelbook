// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines data access methods for managing user accounts, OAuth provider links, and email verification states.
type Repository interface {
	GetAccountByEmail(ctx context.Context, email string) (*Account, error)
	CreateAccount(
		ctx context.Context,
		tx pgx.Tx,
		acc *Account,
	) (*Account, error)
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of auth repositoryDB with the provided database connection pool.
func NewRepositoryDB(db *pgxpool.Pool) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) GetAccountByEmail(ctx context.Context, email string) (*Account, error) {
	query := `
		SELECT 
			a.id,
			a.email,
			a.username,
			a.password_hash,
			a.email_verified,
			a.deleted_at,
			COALESCE(ARRAY_AGG(r.role) FILTER (WHERE r.role IS NOT NULL), '{}') AS roles
		FROM accounts a
		LEFT JOIN account_roles r ON a.id = r.account_id
		WHERE a.email = $1
		GROUP BY a.id
	`

	var acc Account
	if err := r.db.QueryRow(ctx, query, email).Scan(
		&acc.ID,
		&acc.Email,
		&acc.Username,
		&acc.PasswordHash,
		&acc.EmailVerified,
		&acc.DeletedAt,
		&acc.Roles,
	); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAccountNotFound
		}

		return nil, err
	}

	return &acc, nil
}

func (r *repositoryDB) CreateAccount(
	ctx context.Context,
	tx pgx.Tx,
	acc *Account,
) (*Account, error) {
	query := `
		INSERT INTO accounts (id, email, email_verified)
		VALUES ($1, $2, $3)
	`
	_, err := tx.Exec(
		ctx,
		query,
		acc.ID,
		acc.Email,
		acc.EmailVerified,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to insert account: %w", err)
	}

	queryInsertRole := `INSERT INTO account_roles (account_id, role) VALUES ($1, $2)`

	if len(acc.Roles) > 0 {
		for _, role := range acc.Roles {
			_, err = tx.Exec(ctx, queryInsertRole, acc.ID, role)
			if err != nil {
				return nil, fmt.Errorf("failed to insert role %s: %w", role, err)
			}
		}
	}

	return acc, nil
}
