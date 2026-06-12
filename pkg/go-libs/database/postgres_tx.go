// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// TxManager defines the interface for managing PostgreSQL database transactions.
type TxManager interface {
	ExecInTx(
		ctx context.Context,
		fn func(ctx context.Context, tx pgx.Tx) error,
		opts ...TxOption,
	) error
	ExecInTxWithRetry(
		ctx context.Context,
		maxRetries int,
		fn func(ctx context.Context, tx pgx.Tx) error,
		opts ...TxOption,
	) error
	ExecSavepoint(
		ctx context.Context,
		tx pgx.Tx,
		name string,
		fn func(ctx context.Context) error,
	) error
}

type pgxTxManager struct {
	pool *pgxpool.Pool
}

// NewTxManager creates a new transaction manager backed by a pgxpool.Pool.
func NewTxManager(pool *pgxpool.Pool) TxManager {
	return &pgxTxManager{pool: pool}
}

// TxConfig holds transaction options and execution timeouts.
type TxConfig struct {
	Options pgx.TxOptions
	Timeout time.Duration
}

// TxOption configures database transaction settings.
type TxOption func(*TxConfig)

// WithIsoLevel sets the isolation level for the transaction.
func WithIsoLevel(level pgx.TxIsoLevel) TxOption {
	return func(c *TxConfig) {
		c.Options.IsoLevel = level
	}
}

// WithAccessMode sets the access mode (e.g., ReadOnly, ReadWrite) for the transaction.
func WithAccessMode(mode pgx.TxAccessMode) TxOption {
	return func(c *TxConfig) {
		c.Options.AccessMode = mode
	}
}

// WithTimeout sets a custom timeout duration for the transaction context.
func WithTimeout(timeout time.Duration) TxOption {
	return func(c *TxConfig) {
		c.Timeout = timeout
	}
}

// ExecInTx executes a function within a database transaction with automatic rollback/commit handling.
func (m *pgxTxManager) ExecInTx(
	ctx context.Context,
	fn func(ctx context.Context, tx pgx.Tx) error,
	opts ...TxOption,
) error {
	cfg := TxConfig{
		Options: pgx.TxOptions{
			IsoLevel:   pgx.ReadCommitted,
			AccessMode: pgx.ReadWrite,
		},
		Timeout: 5 * time.Second,
	}

	for _, opt := range opts {
		opt(&cfg)
	}

	txCtx, cancel := context.WithTimeout(ctx, cfg.Timeout)
	defer cancel()

	tx, err := m.pool.BeginTx(txCtx, cfg.Options)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(txCtx)
			panic(p)
		}
	}()

	if err := fn(txCtx, tx); err != nil {
		if rbErr := tx.Rollback(txCtx); rbErr != nil && !errors.Is(rbErr, pgx.ErrTxClosed) {
			return fmt.Errorf("transaction error: %v, rollback error: %w", err, rbErr)
		}
		return err
	}

	if err := tx.Commit(txCtx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

// ExecInTxWithRetry executes a transaction and retries on serialization failures or deadlocks.
func (m *pgxTxManager) ExecInTxWithRetry(
	ctx context.Context,
	maxRetries int,
	fn func(ctx context.Context, tx pgx.Tx) error,
	opts ...TxOption,
) error {
	var err error
	backoff := 50 * time.Millisecond

	for attempt := 1; attempt <= maxRetries; attempt++ {
		err = m.ExecInTx(ctx, fn, opts...)
		if err == nil {
			return nil
		}

		// Retry on Postgres Serialization Failure (40001) or Deadlock Detected (40P01)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && (pgErr.Code == "40001" || pgErr.Code == "40P01") {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(backoff):
				backoff *= 2
				continue
			}
		}

		return err
	}

	return fmt.Errorf("transaction aborted after %d retries: %w", maxRetries, err)
}

// ExecSavepoint executes a function within a named savepoint inside an active transaction.
func (m *pgxTxManager) ExecSavepoint(
	ctx context.Context,
	tx pgx.Tx,
	name string,
	fn func(ctx context.Context) error,
) error {
	if _, err := tx.Exec(ctx, "SAVEPOINT "+name); err != nil {
		return fmt.Errorf("failed to establish savepoint %s: %w", name, err)
	}

	if err := fn(ctx); err != nil {
		_, _ = tx.Exec(ctx, "ROLLBACK TO SAVEPOINT "+name)
		return err
	}

	if _, err := tx.Exec(ctx, "RELEASE SAVEPOINT "+name); err != nil {
		return fmt.Errorf("failed to release savepoint %s: %w", name, err)
	}

	return nil
}
