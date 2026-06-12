// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package messaging

import (
	"context"
	"fmt"
	"strings"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// KafkaProducer defines the interface for publishing messages to Kafka topics.
type KafkaProducer interface {
	Publish(ctx context.Context, topic string, key, payload []byte) error
	Close(timeoutMs int)
}

type kafkaProducer struct {
	producer *kafka.Producer
	logger   *zaplog.Logger
}

// NewKafkaProducer creates and initializes a new Kafka producer instance.
func NewKafkaProducer(
	appMode string,
	cfg *config.KafkaClusterConfig,
	logger *zaplog.Logger,
) (KafkaProducer, error) {
	if cfg.Brokers == "" {
		return nil, fmt.Errorf("kafka setup error: no broker hosts provided")
	}

	if logger == nil {
		logger = zaplog.NewNop()
	}

	log := logger.Named("kafka.producer")

	configMap := &kafka.ConfigMap{
		"bootstrap.servers": cfg.Brokers,
	}

	if err := applyProducerModeConfig(configMap, appMode); err != nil {
		return nil, err
	}

	if err := applyProducerSecurityConfig(configMap, cfg); err != nil {
		return nil, err
	}

	p, err := kafka.NewProducer(configMap)
	if err != nil {
		return nil, fmt.Errorf("kafka init error: %w", err)
	}

	// Connection Ping Check
	_, err = p.GetMetadata(nil, false, 5000)
	if err != nil {
		p.Close()
		return nil, fmt.Errorf("kafka ping verification error: %w", err)
	}

	kp := &kafkaProducer{
		producer: p,
		logger:   log,
	}

	// Start background reader for internal librdkafka events/errors
	go kp.listenEvents()

	log.Info("kafka producer initialized successfully", zap.String("brokers", cfg.Brokers))
	return kp, nil
}

func applyProducerModeConfig(configMap *kafka.ConfigMap, appMode string) error {
	var settings map[string]any

	switch strings.ToLower(appMode) {
	case "prod", "production", "staging":
		settings = map[string]any{
			"acks":                                  "all",
			"enable.idempotence":                    true,
			"retries":                               5,
			"max.in.flight.requests.per.connection": 5,
			"compression.type":                      "snappy",
			"linger.ms":                             10,
		}
	case "dev", "development", "local", "":
		settings = map[string]any{
			"acks":             "1",
			"retries":          1,
			"compression.type": "none",
		}
	default:
		return fmt.Errorf("kafka setup error: invalid mode %q", appMode)
	}

	for key, val := range settings {
		if err := configMap.SetKey(key, val); err != nil {
			return fmt.Errorf("kafka setup error: %w", err)
		}
	}

	return nil
}

func applyProducerSecurityConfig(configMap *kafka.ConfigMap, cfg *config.KafkaClusterConfig) error {
	if cfg.SecurityProtocol == "" {
		return nil
	}

	if err := configMap.SetKey("security.protocol", cfg.SecurityProtocol); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}

	if cfg.Username == "" {
		return nil
	}

	if err := configMap.SetKey("sasl.mechanism", cfg.SaslMechanism); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}
	if err := configMap.SetKey("sasl.username", cfg.Username); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}
	if err := configMap.SetKey("sasl.password", cfg.Password); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}

	return nil
}

// listenEvents drains producer.Events() to prevent memory leaks and logs internal client errors
func (kp *kafkaProducer) listenEvents() {
	for e := range kp.producer.Events() {
		switch ev := e.(type) {
		case kafka.Error:
			// High severity client-level error (broker disconnect, auth failure, etc.)
			if ev.IsFatal() {
				kp.logger.Fatal("kafka fatal error", zap.Error(ev))
			} else {
				kp.logger.Error("kafka internal client error",
					zap.String("code", ev.Code().String()),
					zap.Error(ev),
				)
			}
		default:
			// Log unexpected system events if needed during debugging
			kp.logger.Debug("kafka system event received", zap.String("event", ev.String()))
		}
	}
}

// Publish sends a message synchronously to a Kafka topic.
func (kp *kafkaProducer) Publish(ctx context.Context, topic string, key, payload []byte) error {
	// Buffer size of 1 ensures non-blocking delivery even if context times out
	deliveryChan := make(chan kafka.Event, 1)

	err := kp.producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Key:            key,
		Value:          payload,
	}, deliveryChan)
	if err != nil {
		kp.logger.Error("failed to enqueue kafka message",
			zap.String("topic", topic),
			zap.Error(err),
		)
		return fmt.Errorf("kafka produce enqueue error: %w", err)
	}

	select {
	case <-ctx.Done():
		kp.logger.Warn("kafka publish canceled by context timeout",
			zap.String("topic", topic),
			zap.Error(ctx.Err()),
		)
		return ctx.Err()

	case e := <-deliveryChan:
		m, ok := e.(*kafka.Message)
		if !ok {
			return fmt.Errorf("unexpected event type received: %T", e)
		}

		if m.TopicPartition.Error != nil {
			kp.logger.Error("kafka delivery failed",
				zap.String("topic", topic),
				zap.Int32("partition", m.TopicPartition.Partition),
				zap.Error(m.TopicPartition.Error),
			)
			return fmt.Errorf("kafka delivery error: %w", m.TopicPartition.Error)
		}

		kp.logger.Debug("kafka message published successfully",
			zap.String("topic", *m.TopicPartition.Topic),
			zap.Int32("partition", m.TopicPartition.Partition),
			zap.Int64("offset", int64(m.TopicPartition.Offset)),
		)
		return nil
	}
}

// Close flushes any pending messages and shuts down the Kafka producer.
func (kp *kafkaProducer) Close(timeoutMs int) {
	kp.logger.Info("flushing and closing kafka producer...")
	unflushed := kp.producer.Flush(timeoutMs)
	if unflushed > 0 {
		kp.logger.Warn(
			"kafka producer closed with unflushed messages",
			zap.Int("unflushed_count", unflushed),
		)
	}
	kp.producer.Close()
	kp.logger.Info("kafka producer closed successfully")
}
