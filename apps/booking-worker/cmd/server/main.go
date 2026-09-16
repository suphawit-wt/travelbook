// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/booking-worker/internal/booking"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

func main() {
	if err := run(); err != nil {
		log.Printf("fatal startup/runtime error: %v", err)
		os.Exit(1)
	}
}

func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	baseLogger, err := zaplog.NewLogger(cfg.App.Mode, &cfg.Logger)
	if err != nil {
		return fmt.Errorf("init logger: %w", err)
	}
	defer func() {
		_ = baseLogger.Sync()
	}()

	appLogger := baseLogger.Named("travelbook").Named("booking_worker")
	infraLogger := appLogger.Named("infra")
	redisLogger := infraLogger.Named("redis")
	workerLogger := appLogger.Named("worker")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "booking_worker"),
		zap.String("mode", string(cfg.App.Mode)),
	)

	rdb, err := database.NewRedisClient(cfg.App.Mode, &cfg.DB.Redis)
	if err != nil {
		return fmt.Errorf("init redis: %w", err)
	}
	defer func() {
		redisLogger.Info("closing redis client connection")
		if err = rdb.Close(); err != nil {
			redisLogger.Error("redis close error", zap.Error(err))
		}
	}()

	kafkaProducer, err := messaging.NewKafkaProducer(
		cfg.App.Mode,
		&cfg.Messaging.Kafka.Cluster,
		infraLogger,
	)
	if err != nil {
		return fmt.Errorf("init kafka producer: %w", err)
	}
	defer func() {
		infraLogger.Named("kafka.producer").Info("flushing and closing kafka producer client")
		kafkaProducer.Close(5000) // 5s flush timeout
	}()

	bookingModule := booking.NewModule(appLogger.Named("domain"), kafkaProducer, rdb)

	bookingModule.StartWorker(ctx)

	workerLogger.Info("worker gracefully shut down, closing resources and exiting")
	return nil
}
