// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package messaging

import (
	"context"

	"github.com/stretchr/testify/mock"
)

// KafkaProducerMock is a mock implementation of the KafkaProducer interface for testing.
type KafkaProducerMock struct{ mock.Mock }

// Publish provides a mock implementation for publishing Kafka messages.
func (m *KafkaProducerMock) Publish(ctx context.Context, topic string, key, value []byte) error {
	args := m.Called(ctx, topic, key, value)
	return args.Error(0)
}

// Close provides a mock implementation for closing the Kafka producer.
func (m *KafkaProducerMock) Close(timeoutMs int) {
	m.Called(timeoutMs)
}
