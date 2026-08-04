// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package outbox

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access interface for managing Outbox records.
type Repository interface {
	Create(
		ctx context.Context,
		tx pgx.Tx,
		aggType, aggID, eventType, topic string,
		jsonPayload []byte,
	) error
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of outbox repositoryDB with the provided database connection pool.
func NewRepositoryDB(db *pgxpool.Pool) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) Create(
	ctx context.Context,
	tx pgx.Tx,
	aggregateType, aggregateID, eventType, topic string,
	jsonPayload []byte,
) error {
	query := `
    INSERT INTO outbox (
        id, 
        aggregate_type, 
        aggregate_id, 
        event_type, 
        topic, 
        payload
    ) VALUES ($1, $2, $3, $4, $5, $6)
    `

	outboxID, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("failed to generate outbox id uuid v7: %w", err)
	}

	_, err = tx.Exec(
		ctx,
		query,
		outboxID,
		aggregateType,
		aggregateID,
		eventType,
		topic,
		jsonPayload,
	)
	if err != nil {
		return fmt.Errorf("failed to insert outbox record: %w", err)
	}

	return nil
}
