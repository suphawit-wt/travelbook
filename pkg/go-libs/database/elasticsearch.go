// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"bytes"
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/elastic/elastic-transport-go/v8/elastictransport"
	"github.com/elastic/go-elasticsearch/v9"
	"github.com/elastic/go-elasticsearch/v9/esutil"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// EsBulkIndexerConfig holds parameters for batch ingestion tuning
type EsBulkIndexerConfig struct {
	Index         string        // Target Elasticsearch index name
	NumWorkers    int           // Number of concurrent worker goroutines (Default: 4)
	FlushBytes    int           // Flush buffer size in bytes (Default: 2MB)
	FlushInterval time.Duration // Flush buffer time threshold (Default: 500ms)
}

// ElasticsearchClient wraps the official Elasticsearch v8 client with custom logging and helper methods
type ElasticsearchClient struct {
	Client *elasticsearch.Client
	log    *zaplog.Logger
	mode   string
}

// BulkIndexer manages asynchronous batch writes
type BulkIndexer struct {
	indexer esutil.BulkIndexer
	log     *zaplog.Logger
	index   string
}

// NewElasticsearschClient creates a connection pool and ping-verifies the Elasticsearch cluster
func NewElasticsearschClient(
	appMode string,
	cfg *config.ElasticsearchConfig,
	logger *zaplog.Logger,
) (*ElasticsearchClient, error) {
	appMode = strings.ToLower(appMode)

	if len(cfg.Addresses) == 0 {
		return nil, fmt.Errorf("elasticsearch setup error: no cluster addresses provided")
	}

	if logger == nil {
		logger = zaplog.NewNop()
	}

	log := logger.Named("elasticsearch")

	// Base HTTP Transport
	transport := &http.Transport{
		ExpectContinueTimeout: 1 * time.Second,
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
	}

	opts := []elasticsearch.Option{
		elasticsearch.WithAddresses(cfg.Addresses...),
	}

	if cfg.APIKey != "" {
		opts = append(opts, elasticsearch.WithAPIKey(cfg.APIKey))
	}
	if cfg.Username != "" && cfg.Password != "" {
		opts = append(opts, elasticsearch.WithBasicAuth(cfg.Username, cfg.Password))
	}

	switch appMode {
	case "prod", "production", "staging":
		// 1. Connection Pooling Strategy
		transport.MaxIdleConnsPerHost = 50
		transport.MaxIdleConns = 100
		transport.IdleConnTimeout = 90 * time.Second
		transport.TLSHandshakeTimeout = 10 * time.Second

		// 2. Strict TLS Security Setup
		tlsConfig := &tls.Config{
			MinVersion: tls.VersionTLS12,
		}

		if cfg.CACertPath != "" {
			caCert, err := os.ReadFile(cfg.CACertPath)
			if err != nil {
				return nil, fmt.Errorf("failed to read ES CA cert file: %w", err)
			}
			caCertPool := x509.NewCertPool()
			caCertPool.AppendCertsFromPEM(caCert)
			tlsConfig.RootCAs = caCertPool
		}
		transport.TLSClientConfig = tlsConfig

		// 3. Retry Policy for High Load/Rate Limits (429 = Circuit Breaker / Queue Full)
		opts = append(opts,
			elasticsearch.WithRetry(5, 502, 503, 504, 429),
		)

	case "dev", "development", "local", "":
		// Lightweight defaults for local development
		transport.MaxIdleConnsPerHost = 5
		transport.MaxIdleConns = 10
		transport.IdleConnTimeout = 30 * time.Second

		if cfg.InsecureSkipVerify {
			// #nosec G402 -- Allowed for local development environments
			transport.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
		}

		opts = append(opts,
			elasticsearch.WithRetry(2, 502, 503, 504),
		)

	default:
		return nil, fmt.Errorf(
			"elasticsearch setup error: invalid env %q (must be dev, staging, or prod)",
			appMode,
		)
	}

	opts = append(opts,
		elasticsearch.WithTransportOptions(elastictransport.WithTransport(transport)),
	)

	es, err := elasticsearch.New(opts...)
	if err != nil {
		return nil, fmt.Errorf("elasticsearch init error: %w", err)
	}

	client := &ElasticsearchClient{
		Client: es,
		log:    log,
		mode:   appMode,
	}

	// Verify Cluster Ping
	if err := client.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("elasticsearch ping verification error: %w", err)
	}

	log.Info("elasticsearch client initialized successfully",
		zap.Strings("addresses", cfg.Addresses),
		zap.String("mode", appMode),
	)

	return client, nil
}

// Ping checks cluster connectivity
func (c *ElasticsearchClient) Ping(ctx context.Context) error {
	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	res, err := c.Client.Info(c.Client.Info.WithContext(pingCtx))
	if err != nil {
		return fmt.Errorf("cluster health check failed: %w", err)
	}
	defer func() {
		_ = res.Body.Close()
	}()

	if res.IsError() {
		return fmt.Errorf("cluster returned error status: %s", res.Status())
	}

	return nil
}

// NewBulkIndexer instantiates a high-throughput async Bulk Indexer bound to this client
func (c *ElasticsearchClient) NewBulkIndexer(opts EsBulkIndexerConfig) (*BulkIndexer, error) {
	if opts.Index == "" {
		return nil, fmt.Errorf("bulk indexer requires a target index name")
	}

	if opts.NumWorkers == 0 {
		opts.NumWorkers = 4
	}
	if opts.FlushBytes == 0 {
		opts.FlushBytes = 2 * 1024 * 1024 // 2MB
	}
	if opts.FlushInterval == 0 {
		opts.FlushInterval = 500 * time.Millisecond
	}

	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Client:        c.Client,
		Index:         opts.Index,
		NumWorkers:    opts.NumWorkers,
		FlushBytes:    opts.FlushBytes,
		FlushInterval: opts.FlushInterval,
		OnError: func(ctx context.Context, err error) {
			c.log.Error("bulk indexer internal system error", zap.Error(err))
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create bulk indexer: %w", err)
	}

	c.log.Info("elasticsearch bulk indexer initialized",
		zap.String("index", opts.Index),
		zap.Int("workers", opts.NumWorkers),
		zap.Int("flush_bytes", opts.FlushBytes),
		zap.Duration("flush_interval", opts.FlushInterval),
	)

	return &BulkIndexer{
		indexer: bi,
		log:     c.log,
		index:   opts.Index,
	}, nil
}

// Add queues an action ("index", "create", "update", "delete") into the bulk buffer
func (b *BulkIndexer) Add(ctx context.Context, docID, action string, payload []byte) error {
	var bodyReader *bytes.Reader
	if len(payload) > 0 {
		bodyReader = bytes.NewReader(payload)
	}

	item := esutil.BulkIndexerItem{
		Action:     action,
		DocumentID: docID,
		OnSuccess: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem) {
			b.log.Debug("bulk document indexed successfully",
				zap.String("index", b.index),
				zap.String("doc_id", docID),
				zap.String("action", action),
			)
		},
		OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
			if err != nil {
				b.log.Error(
					"bulk item processing error",
					zap.String("doc_id", docID),
					zap.Error(err),
				)
			} else {
				b.log.Error("bulk item rejected by elasticsearch",
					zap.String("doc_id", docID),
					zap.String("type", res.Error.Type),
					zap.String("reason", res.Error.Reason),
				)
			}
		},
	}

	if bodyReader != nil {
		item.Body = bodyReader
	}

	return b.indexer.Add(ctx, item)
}

// Close flushes buffered documents and shuts down workers
func (b *BulkIndexer) Close(ctx context.Context) error {
	b.log.Info(
		"flushing remaining documents and closing bulk indexer...",
		zap.String("index", b.index),
	)
	return b.indexer.Close(ctx)
}
