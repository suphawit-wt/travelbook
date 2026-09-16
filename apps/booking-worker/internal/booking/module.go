// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Module encapsulates the user module, including its service component.
type Module struct {
	logger           *zaplog.Logger
	kafkaProducer    messaging.KafkaProducer
	redisClient      *redis.Client
	service          Service
	popExpiredScript *redis.Script
}

// NewModule initializes a new instance of the user module with the provided database connection pool.
func NewModule(
	logger *zaplog.Logger,
	kafkaProducer messaging.KafkaProducer,
	redisClient *redis.Client,
) *Module {
	svcLogger := logger.Named("service")

	svc := NewService(svcLogger, kafkaProducer)

	popScript := redis.NewScript(`
		local expired = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[2])
		if #expired > 0 then
			redis.call('ZREM', KEYS[1], unpack(expired))
		end
		return expired
	`)

	return &Module{
		logger:           logger,
		redisClient:      redisClient,
		service:          svc,
		popExpiredScript: popScript,
	}
}

// StartWorker starts the Redis polling loop to process publishing booking timeout messages.
func (m *Module) StartWorker(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	m.logger.Info("booking worker started")

	for {
		select {
		case <-ctx.Done():
			m.logger.Info("stopping booking worker context signal received")
			return
		case <-ticker.C:
			m.processBatch(ctx)
		}
	}
}

func (m *Module) processBatch(ctx context.Context) {
	now := time.Now().Unix()

	// 1. Atomic Fetch & Remove (Prevents split-brain/duplicate reads across instances)
	res, err := m.popExpiredScript.Run(ctx, m.redisClient, []string{"booking:expiry_set"}, now, 100).
		Slice()
	if err != nil {
		if !errors.Is(err, redis.Nil) {
			m.logger.Error("failed to pop expired bookings from redis", zap.Error(err))
		}
		return
	}

	if len(res) == 0 {
		return
	}

	// 2. Concurrent Processing with Error Handling
	var wg sync.WaitGroup
	for _, item := range res {
		expiredBookingID, ok := item.(string)
		if !ok {
			continue
		}

		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			correlationID := fmt.Sprintf("corr_%s", id)

			// Execute with a isolated timeout context so main context cancellation doesn't break in-flight messages
			pubCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()

			if err := m.service.PublishTimeoutExpired(pubCtx, correlationID, id); err != nil {
				m.logger.Error("failed to publish booking timeout event",
					zap.String("booking_id", id),
					zap.String("correlation_id", correlationID),
					zap.Error(err),
				)
				// Production practice: Re-queue to Redis or send to Dead Letter Queue (DLQ)
				m.requeueExpiredBooking(pubCtx, id)
			}
		}(expiredBookingID)
	}
	wg.Wait()
}

func (m *Module) requeueExpiredBooking(ctx context.Context, bookingID string) {
	// Re-add to Redis with a short exponential backoff delay (e.g., retry in 10s)
	retryAt := time.Now().Add(10 * time.Second).Unix()
	if err := m.redisClient.ZAdd(ctx, "booking:expiry_set", redis.Z{
		Score:  float64(retryAt),
		Member: bookingID,
	}).Err(); err != nil {
		m.logger.Error("critical: failed to requeue failed booking event to redis",
			zap.String("booking_id", bookingID),
			zap.Error(err),
		)
	}
}
