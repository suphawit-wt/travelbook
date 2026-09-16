// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the interface for bookings timeout.
type Service interface {
	PublishTimeoutExpired(ctx context.Context, correlationID, bookingID string) error
}

type service struct {
	logger        *zaplog.Logger
	kafkaProducer messaging.KafkaProducer
}

// NewService creates a new instance of Service with the provided Kafka producer.
func NewService(
	logger *zaplog.Logger,
	kafkaProducer messaging.KafkaProducer,
) Service {
	return &service{logger: logger, kafkaProducer: kafkaProducer}
}

func (s *service) PublishTimeoutExpired(
	ctx context.Context,
	correlationID, bookingID string,
) error {
	eventID := "evt_" + uuid.New().String()
	topic := "dev.booking.timeout.expired.v1"

	// Enforce context-aware logger with correlation fields
	logger := s.logger.Named("publish_timeout_expired").With(
		zap.String("event_id", eventID),
		zap.String("correlation_id", correlationID),
		zap.String("booking_id", bookingID),
		zap.String("topic", topic),
	)

	// Strongly typed event structure
	envelope := EventPayload[TimeoutExpiredData]{
		Metadata: Metadata{
			EventID:       eventID,
			CorrelationID: correlationID,
			EventType:     "BookingTimeoutExpired",
			CreatedAt:     time.Now().UTC(), // Explicit UTC time in events
		},
		Data: TimeoutExpiredData{
			BookingID: bookingID,
		},
	}

	payloadBytes, err := json.Marshal(envelope)
	if err != nil {
		logger.Error("failed to marshal event payload", zap.Error(err))
		return fmt.Errorf("marshal timeout expired payload: %w", err)
	}

	if err := s.kafkaProducer.Publish(ctx, topic, []byte(bookingID), payloadBytes); err != nil {
		logger.Error("failed to publish booking timeout event to Kafka", zap.Error(err))
		return fmt.Errorf("publish message to kafka topic %s: %w", topic, err)
	}

	logger.Debug("successfully published booking timeout event")
	return nil
}
