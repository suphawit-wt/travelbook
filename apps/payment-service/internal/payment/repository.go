// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package payment

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for payment entities.
type Repository interface {
	MarkAsPaid(
		ctx context.Context,
		bookingID uuid.UUID, paymentIntentID string,
		amount int64,
		currency, paymentMethod string,
	) error
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(
	db *pgxpool.Pool,
) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) MarkAsPaid(
	ctx context.Context,
	bookingID uuid.UUID, paymentIntentID string,
	amount int64,
	currency, paymentMethod string,
) error {
	paymentQuery := `
        INSERT INTO payments (
            id, booking_id,
            provider,
			provider_payment_id,
			amount,
            currency_code,
			status,
			payment_method
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `

	paymentID, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("failed to generate id uuid v7: %w", err)
	}

	_, err = r.db.Exec(
		ctx,
		paymentQuery,
		paymentID,
		bookingID,
		"stripe",
		paymentIntentID,
		amount,
		currency,
		"succeeded",
		paymentMethod,
	)
	if err != nil {
		return err
	}

	return nil
}
