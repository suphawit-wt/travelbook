// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/stretchr/testify/mock"
)

// TxManagerMock provides a mock implementation of TxManager for testing.
type TxManagerMock struct{ mock.Mock }

// ExecInTx mocks execution of a function within a transaction.
func (m *TxManagerMock) ExecInTx(
	ctx context.Context,
	fn func(ctx context.Context, tx pgx.Tx) error,
	opts ...TxOption,
) error {
	// Variadic options handling for testify matching
	argsList := make([]any, 0, 2+len(opts))
	argsList = append(argsList, ctx, fn)
	for _, opt := range opts {
		argsList = append(argsList, opt)
	}

	args := m.Called(argsList...)

	// Execute transaction callback inline if configured in mock
	if fn != nil && args.Error(0) == nil {
		mockTx := new(PgxTxMock)
		if err := fn(ctx, mockTx); err != nil {
			return err
		}
	}

	return args.Error(0)
}

// ExecInTxWithRetry mocks transactional execution with retry logic.
func (m *TxManagerMock) ExecInTxWithRetry(
	ctx context.Context,
	maxRetries int,
	fn func(ctx context.Context, tx pgx.Tx) error,
	opts ...TxOption,
) error {
	args := m.Called(ctx, maxRetries, fn, opts)
	if err := args.Error(0); err != nil {
		return err
	}
	return fn(ctx, nil)
}

// ExecSavepoint mocks transactional savepoint execution.
func (m *TxManagerMock) ExecSavepoint(
	ctx context.Context,
	tx pgx.Tx,
	name string,
	fn func(ctx context.Context) error,
) error {
	args := m.Called(ctx, tx, name, fn)
	if err := args.Error(0); err != nil {
		return err
	}
	return fn(ctx)
}

// PgxTxMock provides a mock implementation of the pgx.Tx interface for testing.
type PgxTxMock struct {
	mock.Mock
}

// Begin mocks beginning a sub-transaction.
func (m *PgxTxMock) Begin(ctx context.Context) (pgx.Tx, error) {
	args := m.Called(ctx)
	return args.Get(0).(pgx.Tx), args.Error(1)
}

// Commit mocks committing the transaction.
func (m *PgxTxMock) Commit(ctx context.Context) error {
	return m.Called(ctx).Error(0)
}

// Rollback mocks rolling back the transaction.
func (m *PgxTxMock) Rollback(ctx context.Context) error {
	return m.Called(ctx).Error(0)
}

// CopyFrom mocks bulk copying rows into a table.
func (m *PgxTxMock) CopyFrom(
	ctx context.Context,
	tableName pgx.Identifier,
	columnNames []string,
	rowSource pgx.CopyFromSource,
) (int64, error) {
	args := m.Called(ctx, tableName, columnNames, rowSource)
	return args.Get(0).(int64), args.Error(1)
}

// SendBatch mocks executing a batch of queries.
func (m *PgxTxMock) SendBatch(ctx context.Context, b *pgx.Batch) pgx.BatchResults {
	return m.Called(ctx, b).Get(0).(pgx.BatchResults)
}

// LargeObjects mocks accessing PostgreSQL large object operations.
func (m *PgxTxMock) LargeObjects() pgx.LargeObjects {
	return m.Called().Get(0).(pgx.LargeObjects)
}

// Prepare mocks preparing a statement within the transaction.
func (m *PgxTxMock) Prepare(
	ctx context.Context,
	name, sql string,
) (*pgconn.StatementDescription, error) {
	args := m.Called(ctx, name, sql)
	return args.Get(0).(*pgconn.StatementDescription), args.Error(1)
}

// Exec mocks executing an SQL statement within the transaction.
func (m *PgxTxMock) Exec(
	ctx context.Context,
	sql string,
	arguments ...any,
) (pgconn.CommandTag, error) {
	argsList := make([]any, 0, 2+len(arguments))
	argsList = append(argsList, ctx, sql)
	argsList = append(argsList, arguments...)
	args := m.Called(argsList...)
	return args.Get(0).(pgconn.CommandTag), args.Error(1)
}

// Query mocks executing an SQL query within the transaction.
func (m *PgxTxMock) Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error) {
	argsList := make([]any, 0, 2+len(args))
	argsList = append(argsList, ctx, sql)
	argsList = append(argsList, args...)
	mArgs := m.Called(argsList...)
	return mArgs.Get(0).(pgx.Rows), mArgs.Error(1)
}

// QueryRow mocks executing a query returning a single row within the transaction.
func (m *PgxTxMock) QueryRow(ctx context.Context, sql string, args ...any) pgx.Row {
	argsList := make([]any, 0, 2+len(args))
	argsList = append(argsList, ctx, sql)
	argsList = append(argsList, args...)
	return m.Called(argsList...).Get(0).(pgx.Row)
}

// Conn mocks returning the underlying database connection.
func (m *PgxTxMock) Conn() *pgx.Conn {
	return m.Called().Get(0).(*pgx.Conn)
}

// Savepoint mocks creating a named savepoint within the transaction.
func (m *PgxTxMock) Savepoint(ctx context.Context, name string) (pgx.Tx, error) {
	args := m.Called(ctx, name)
	return args.Get(0).(pgx.Tx), args.Error(1)
}

// RollbackToSavepoint mocks rolling back to a named savepoint.
func (m *PgxTxMock) RollbackToSavepoint(ctx context.Context, name string) error {
	return m.Called(ctx, name).Error(0)
}

// ReleaseSavepoint mocks releasing a named savepoint.
func (m *PgxTxMock) ReleaseSavepoint(ctx context.Context, name string) error {
	return m.Called(ctx, name).Error(0)
}
