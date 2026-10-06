// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) GetAccountByEmail(ctx context.Context, email string) (*Account, error) {
	args := m.Called(ctx, email)
	if acc, ok := args.Get(0).(*Account); ok {
		return acc, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRepository) GetAccountByUsername(
	ctx context.Context,
	username string,
) (*Account, error) {
	args := m.Called(ctx, username)
	if acc, ok := args.Get(0).(*Account); ok {
		return acc, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRepository) CreateAccount(
	ctx context.Context,
	tx pgx.Tx,
	acc *Account,
) (*Account, error) {
	args := m.Called(ctx, tx, acc)
	if createdAcc, ok := args.Get(0).(*Account); ok {
		return createdAcc, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRepository) CreateAccountOAuthProvider(
	ctx context.Context,
	tx pgx.Tx,
	accOP *AccountOAuthProvider,
) (*AccountOAuthProvider, error) {
	args := m.Called(ctx, tx, accOP)
	if createdOP, ok := args.Get(0).(*AccountOAuthProvider); ok {
		return createdOP, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRepository) MarkEmailAsVerified(ctx context.Context, accID uuid.UUID) error {
	args := m.Called(ctx, accID)
	return args.Error(0)
}
