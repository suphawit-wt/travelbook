// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package email

import (
	"context"
	"encoding/json"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/sendgrid/sendgrid-go/v4"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Module encapsulates the email module, including its service component.
type Module struct {
	logger        *zaplog.Logger
	kafkaConsumer messaging.KafkaConsumer
}

// NewModule initializes a new instance of the email module with the provided database connection pool.
func NewModule(
	logger *zaplog.Logger,
	kafkaConsumer messaging.KafkaConsumer,
	sgClient *sendgrid.Client,
) *Module {
	return &Module{
		logger:        logger,
		kafkaConsumer: kafkaConsumer,
	}
}

// StartConsumer starts the consumer loop for processing messages from Kafka.
func (m *Module) StartConsumer(ctx context.Context) error {
	m.logger.Info("Starting email consumer worker loop...")

	return m.kafkaConsumer.SubscribeAndConsume(ctx, m.processMessage)
}

func (m *Module) processMessage(ctx context.Context, msg *kafka.Message) error {
	var envelope EventPayload
	if err := json.Unmarshal(msg.Value, &envelope); err != nil {
		m.logger.Error(
			"Malformed kafka connect envelope (poison pill), skipping payload",
			zap.Error(err),
		)
		return nil // Return nil commits offset and moves past bad message
	}

	m.logger.Info("correalation_id:", zap.String("correlation_id", envelope.Metadata.CorrelationID))
	m.logger.Info("event_id:", zap.String("event_id", envelope.Metadata.EventID))

	var otpPayload OTPPayload
	if err := json.Unmarshal(envelope.Data, &otpPayload); err != nil {
		m.logger.Error("Failed to parse inner otp json payload", zap.Error(err))
		return nil // Malformed business payload: skip & commit
	}

	switch envelope.Metadata.EventType {
	default:
		m.logger.Warn(
			"Unknown event type skipped without processing",
			zap.String("event_type", envelope.Metadata.EventType),
		)
	}

	return nil
}
