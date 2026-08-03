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
	"time"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/search-consumer/internal/search"
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

	appLogger := baseLogger.Named("travelbook").Named("search_consumer")
	infraLogger := appLogger.Named("infra")
	esBulkLogger := infraLogger.Named("elasticsearch.bulk")
	consumerLogger := appLogger.Named("consumer")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "search_consumer"),
		zap.String("mode", string(cfg.App.Mode)),
	)

	esClient, err := database.NewElasticsearschClient(
		cfg.App.Mode,
		&cfg.DB.Elasticsearch,
		infraLogger,
	)
	if err != nil {
		return fmt.Errorf("init elasticsearch client: %w", err)
	}

	esBulk, err := esClient.NewBulkIndexer(database.EsBulkIndexerConfig{
		Index:         "search_properties",
		NumWorkers:    4,
		FlushBytes:    2 * 1024 * 1024, // 2MB
		FlushInterval: 500 * time.Millisecond,
	})
	if err != nil {
		return fmt.Errorf("init elasticsearch bulk indexer: %w", err)
	}
	defer func() {
		esBulkLogger.Info("flushing remaining items and closing bulk indexer")
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if esBulkErr := esBulk.Close(shutdownCtx); esBulkErr != nil {
			esBulkLogger.Error("failed to flush/close bulk indexer", zap.Error(esBulkErr))
		}
	}()

	kafkaConsumer, err := messaging.NewKafkaConsumer(
		cfg.App.Mode,
		&cfg.Messaging.Kafka,
		infraLogger,
	)
	if err != nil {
		return fmt.Errorf("init kafka consumer: %w", err)
	}
	defer func() {
		infraLogger.Named("kafka.consumer").Info("closing kafka consumer client")
		if err := kafkaConsumer.Close(); err != nil {
			infraLogger.Named("kafka.consumer").
				Error("failed to close kafka consumer", zap.Error(err))
		}
	}()

	searchModule := search.NewModule(appLogger.Named("domain"), kafkaConsumer, esBulk)

	if err := searchModule.StartConsumer(ctx); err != nil && err != context.Canceled {
		consumerLogger.Fatal("consumer worker loop crashed", zap.Error(err))
	}

	consumerLogger.Info("consumer gracefully shut down, closing resources and exiting")
	return nil
}
