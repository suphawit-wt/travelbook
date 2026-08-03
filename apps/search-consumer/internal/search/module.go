// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package search

import (
	"context"
	"encoding/json"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Module encapsulates the user module, including its service component.
type Module struct {
	logger        *zaplog.Logger
	kafkaConsumer messaging.KafkaConsumer
	service       Service
}

// NewModule initializes a new instance of the user module with the provided database connection pool.
func NewModule(
	logger *zaplog.Logger,
	kafkaConsumer messaging.KafkaConsumer,
	esBulk *database.BulkIndexer,
) *Module {
	svcLogger := logger.Named("service")

	svc := NewService(svcLogger, esBulk)

	return &Module{
		logger:        logger,
		kafkaConsumer: kafkaConsumer,
		service:       svc,
	}
}

// StartConsumer starts the consumer loop for processing messages from Kafka.
func (m *Module) StartConsumer(ctx context.Context) error {
	m.logger.Info("Starting search consumer worker loop...")

	return m.kafkaConsumer.SubscribeAndConsume(ctx, m.processMessage)
}

func (m *Module) processMessage(ctx context.Context, msg *kafka.Message) error {
	var eventID, aggregateID, eventType string

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

	m.logger.Info("Kafka metadata extracted",
		zap.String("correlation_id", aggregateID),
		zap.String("event_id", eventID),
		zap.String("event_type", eventType),
	)

	var kafkaConnectEnvelope struct {
		Payload json.RawMessage `json:"payload"`
	}

	// Check for malformed JSON envelope (Poison Pill handling)
	if err := json.Unmarshal(msg.Value, &kafkaConnectEnvelope); err != nil {
		m.logger.Error(
			"Malformed kafka connect envelope (poison pill), skipping payload",
			zap.Error(err),
		)
		return nil // Return nil commits offset and moves past bad message
	}

	switch eventType {
	case "PropertyCreated":
		var propertyDoc PropertyDocument
		if err := json.Unmarshal(kafkaConnectEnvelope.Payload, &propertyDoc); err != nil {
			m.logger.Error(
				"Failed to parse inner property json payload for creation",
				zap.Error(err),
			)
			return nil // Malformed business payload: skip & commit
		}

		if err := m.service.CreatePropertyIndex(ctx, &propertyDoc); err != nil {
			m.logger.Error("Failed to create full property index in elasticsearch", zap.Error(err))
			return err // Return error DO NOT commit offset (allows retry)
		}

	case "PropertyLocationUpdated", "PropertyCapacityUpdated", "PropertyStatusUpdated":
		var partialMap map[string]any
		if err := json.Unmarshal(kafkaConnectEnvelope.Payload, &partialMap); err != nil {
			m.logger.Error(
				"Failed to parse inner property json payload for partial update",
				zap.Error(err),
			)
			return nil // Malformed business payload: skip & commit
		}

		if err := m.service.UpdatePropertyIndex(
			ctx,
			aggregateID,
			partialMap,
		); err != nil {
			m.logger.Error(
				"Failed to partially update property index in elasticsearch",
				zap.Error(err),
			)
			return err // Return error DO NOT commit offset (allows retry)
		}

		m.logger.Info("Successfully executed partial update on search index",
			zap.String("event_type", eventType),
			zap.String("id", aggregateID),
		)

	default:
		m.logger.Warn(
			"Unknown event type skipped without processing",
			zap.String("event_type", eventType),
		)
	}

	return nil
}
