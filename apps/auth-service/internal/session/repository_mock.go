// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package session

import (
	"context"
	"time"

	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) SaveOTP(ctx context.Context, key, otp string, ttl time.Duration) error {
	args := m.Called(ctx, key, otp, ttl)
	return args.Error(0)
}

func (m *MockRepository) VerifyOTP(ctx context.Context, key, otp string) (bool, error) {
	args := m.Called(ctx, key, otp)
	return args.Bool(0), args.Error(1)
}

func (m *MockRepository) DeleteOTP(ctx context.Context, key string) (bool, error) {
	args := m.Called(ctx, key)
	return args.Bool(0), args.Error(1)
}

func (m *MockRepository) TrimSessionsByCapacity(
	ctx context.Context, accID, key, clientKey string, maxCapacity int64,
) error {
	args := m.Called(ctx, accID, key, clientKey, maxCapacity)
	return args.Error(0)
}

func (m *MockRepository) Create(
	ctx context.Context, sid, key, accKey string, meta *Metadata, ttl time.Duration,
) error {
	args := m.Called(ctx, sid, key, accKey, meta, ttl)
	return args.Error(0)
}

func (m *MockRepository) GetMetadata(ctx context.Context, key string) (*Metadata, error) {
	args := m.Called(ctx, key)
	if meta, ok := args.Get(0).(*Metadata); ok {
		return meta, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRepository) Revoke(ctx context.Context, key, accKey string) (bool, error) {
	args := m.Called(ctx, key, accKey)
	return args.Bool(0), args.Error(1)
}
