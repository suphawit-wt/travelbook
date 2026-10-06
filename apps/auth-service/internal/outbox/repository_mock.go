// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package outbox

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(
	ctx context.Context, tx pgx.Tx, aggType, aggID, eventType, topic string, payload []byte,
) error {
	args := m.Called(ctx, tx, aggType, aggID, eventType, topic, payload)
	return args.Error(0)
}
