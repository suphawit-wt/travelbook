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

// KafkaMessageHandler defines the function signature for processing a Kafka message.
type KafkaMessageHandler func(ctx context.Context, msg *kafka.Message) error

// KafkaConsumer defines the interface for consuming messages from Kafka topics.
type KafkaConsumer interface {
	SubscribeAndConsume(ctx context.Context, handler KafkaMessageHandler) error
	Close() error
}

type kafkaConsumer struct {
	consumer *kafka.Consumer
	logger   *zaplog.Logger
	topics   []string
}

// NewKafkaConsumer creates and initializes a new Kafka consumer instance.
func NewKafkaConsumer(
	appMode string,
	cfg *config.KafkaConfig,
	logger *zaplog.Logger,
) (KafkaConsumer, error) {
	if cfg.Cluster.Brokers == "" || cfg.Consumer.GroupID == "" || len(cfg.Consumer.Topics) == 0 {
		return nil, fmt.Errorf("kafka setup error: brokers, group_id, and topics are required")
	}

	if logger == nil {
		logger = zaplog.NewNop()
	}

	log := logger.Named("kafka.consumer")

	autoOffset := cfg.Consumer.AutoOffsetReset
	if autoOffset == "" {
		autoOffset = "latest"
	}

	configMap := &kafka.ConfigMap{
		"bootstrap.servers":  cfg.Cluster.Brokers,
		"group.id":           cfg.Consumer.GroupID,
		"auto.offset.reset":  autoOffset,
		"enable.auto.commit": false,
	}

	if err := applyModeConfig(configMap, appMode); err != nil {
		return nil, err
	}

	if err := applySecurityConfig(configMap, cfg); err != nil {
		return nil, err
	}

	c, err := kafka.NewConsumer(configMap)
	if err != nil {
		return nil, fmt.Errorf("kafka consumer init error: %w", err)
	}

	return &kafkaConsumer{
		consumer: c,
		logger:   log,
		topics:   cfg.Consumer.Topics,
	}, nil
}

// SubscribeAndConsume subscribes to configured topics and starts the message consumption loop.
func (kc *kafkaConsumer) SubscribeAndConsume(
	ctx context.Context,
	handler KafkaMessageHandler,
) error {
	err := kc.consumer.SubscribeTopics(kc.topics, kc.handleRebalance)
	if err != nil {
		return fmt.Errorf("failed to subscribe to topics: %w", err)
	}

	kc.logger.Info("started consuming messages", zap.Strings("topics", kc.topics))

	for {
		select {
		case <-ctx.Done():
			kc.logger.Info("stopping consumer loop via context cancellation...")
			return ctx.Err()

		default:
			ev := kc.consumer.Poll(100)
			if ev == nil {
				continue
			}

			if err := kc.handlePollEvent(ctx, ev, handler); err != nil {
				return err
			}
		}
	}
}

// Close gracefully closes the Kafka consumer connection.
func (kc *kafkaConsumer) Close() error {
	kc.logger.Info("closing kafka consumer...")
	err := kc.consumer.Close()
	if err != nil {
		kc.logger.Error("error closing consumer", zap.Error(err))
		return err
	}
	kc.logger.Info("kafka consumer closed successfully")
	return nil
}

func applyModeConfig(configMap *kafka.ConfigMap, appMode string) error {
	switch strings.ToLower(appMode) {
	case "prod", "production", "staging":
		if err := configMap.SetKey("session.timeout.ms", 45000); err != nil {
			return fmt.Errorf("kafka setup error: %w", err)
		}
		if err := configMap.SetKey("max.poll.interval.ms", 300000); err != nil {
			return fmt.Errorf("kafka setup error: %w", err)
		}
	case "dev", "development", "local", "":
		if err := configMap.SetKey("session.timeout.ms", 10000); err != nil {
			return fmt.Errorf("kafka setup error: %w", err)
		}
	default:
		return fmt.Errorf("kafka setup error: invalid mode %q", appMode)
	}
	return nil
}

func applySecurityConfig(configMap *kafka.ConfigMap, cfg *config.KafkaConfig) error {
	if cfg.Cluster.SecurityProtocol == "" {
		return nil
	}

	if err := configMap.SetKey("security.protocol", cfg.Cluster.SecurityProtocol); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}

	if cfg.Cluster.Username == "" {
		return nil
	}

	if err := configMap.SetKey("sasl.mechanism", cfg.Cluster.SaslMechanism); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}
	if err := configMap.SetKey("sasl.username", cfg.Cluster.Username); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}
	if err := configMap.SetKey("sasl.password", cfg.Cluster.Password); err != nil {
		return fmt.Errorf("kafka setup error: %w", err)
	}

	return nil
}

func (kc *kafkaConsumer) handleRebalance(c *kafka.Consumer, event kafka.Event) error {
	switch ev := event.(type) {
	case kafka.AssignedPartitions:
		kc.logger.Info(
			"partitions assigned",
			zap.String("partitions", fmt.Sprintf("%v", ev.Partitions)),
		)
		return c.Assign(ev.Partitions)
	case kafka.RevokedPartitions:
		kc.logger.Warn(
			"partitions revoked",
			zap.String("partitions", fmt.Sprintf("%v", ev.Partitions)),
		)
		return c.Unassign()
	}
	return nil
}

func (kc *kafkaConsumer) handlePollEvent(
	ctx context.Context,
	ev kafka.Event,
	handler KafkaMessageHandler,
) error {
	switch e := ev.(type) {
	case *kafka.Message:
		kc.processMessage(ctx, e, handler)

	case kafka.Error:
		if e.IsFatal() {
			kc.logger.Fatal("kafka consumer fatal error", zap.Error(e))
			return e
		}
		kc.logger.Error("kafka consumer internal error", zap.Error(e))

	case kafka.PartitionEOF:
		kc.logger.Debug("reached partition end-of-file", zap.String("event", e.String()))

	default:
		kc.logger.Debug(
			"received ignored consumer event",
			zap.String("event", fmt.Sprintf("%T", e)),
		)
	}

	return nil
}

func (kc *kafkaConsumer) processMessage(
	ctx context.Context,
	msg *kafka.Message,
	handler KafkaMessageHandler,
) {
	topic := *msg.TopicPartition.Topic
	partition := msg.TopicPartition.Partition
	offset := msg.TopicPartition.Offset

	kc.logger.Debug("processing message",
		zap.String("topic", topic),
		zap.Int32("partition", partition),
		zap.Int64("offset", int64(offset)),
	)

	// Execute business handler
	if err := handler(ctx, msg); err != nil {
		kc.logger.Error("failed to process message",
			zap.String("topic", topic),
			zap.Int32("partition", partition),
			zap.Int64("offset", int64(offset)),
			zap.Error(err),
		)
		// Option: Forward to Dead Letter Queue (DLQ) here or trigger retry policy
		return
	}

	// Commit offset manually after SUCCESSFUL processing (At-Least-Once Delivery)
	_, err := kc.consumer.CommitMessage(msg)
	if err != nil {
		kc.logger.Error("failed to commit message offset",
			zap.String("topic", topic),
			zap.Int32("partition", partition),
			zap.Int64("offset", int64(offset)),
			zap.Error(err),
		)
	}
}
