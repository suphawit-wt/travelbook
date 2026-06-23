// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"
	"encoding/json"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Module encapsulates the user module, including its service component.
type Module struct {
	logger        *zaplog.Logger
	kafkaConsumer messaging.KafkaConsumer
}

// NewModule initializes a new instance of the user module with the provided database connection pool.
func NewModule(
	logger *zaplog.Logger,
	db *pgxpool.Pool,
	kafkaConsumer messaging.KafkaConsumer,
) *Module {
	return &Module{
		logger:        logger,
		kafkaConsumer: kafkaConsumer,
	}
}

// StartConsumer starts the consumer loop for processing messages from Kafka.
func (m *Module) StartConsumer(ctx context.Context) error {
	m.logger.Info("Starting user consumer worker loop...")

	return m.kafkaConsumer.SubscribeAndConsume(ctx, m.processMessage)
}

func (m *Module) processMessage(ctx context.Context, msg *kafka.Message) error {
	var eventID, aggregateID, eventType string

	// Extract Kafka metadata headers
	for _, header := range msg.Headers {
		switch header.Key {
		case "id":
			eventID = string(header.Value)
		case "aggregate_id":
			aggregateID = string(header.Value)
		case "event_type":
			eventType = string(header.Value)
		}
	}

	m.logger.Info("Kafka event received",
		zap.String("correlation_id", aggregateID),
		zap.String("event_id", eventID),
		zap.String("event_type", eventType),
	)

	var kafkaConnectEnvelope OutboxEvent

	// Check for malformed JSON envelope (Poison Pill handling)
	if err := json.Unmarshal(msg.Value, &kafkaConnectEnvelope); err != nil {
		m.logger.Error(
			"Malformed kafka connect envelope (poison pill), skipping payload",
			zap.Error(err),
		)
		return nil // Return nil commits offset and moves past bad message
	}

	switch eventType {
	default:
		m.logger.Warn(
			"Unknown event type skipped without processing",
			zap.String("event_type", eventType),
		)
	}

	return nil
}
