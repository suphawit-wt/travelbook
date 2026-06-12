// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"
	"fmt"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// NewMongoClient creates and initializes a new MongoDB client instance.
func NewMongoClient(appMode string, cfg *config.MongoConfig) (*mongo.Client, error) {
	if cfg.URL == "" {
		return nil, fmt.Errorf("mongo setup error: database URL cannot be empty")
	}

	appMode = strings.ToLower(appMode)
	opts := options.Client().ApplyURI(cfg.URL)

	maxPool := uint64(20)
	if cfg.PoolMax > 0 {
		maxPool = cfg.PoolMax
	} else if appMode == envProd || appMode == envProduction || appMode == envStaging {
		maxPool = 50
	}

	minPool := uint64(2)
	if appMode == envDev || appMode == envDevelopment || appMode == envLocal {
		minPool = 1
	}

	queryTimeout := 3 * time.Second
	if appMode == envProd || appMode == envProduction || appMode == envStaging {
		queryTimeout = 5 * time.Second
	}

	opts.SetMaxPoolSize(maxPool).
		SetMinPoolSize(minPool).
		SetMaxConnIdleTime(1 * time.Minute).
		SetServerSelectionTimeout(queryTimeout).
		SetTimeout(queryTimeout)

	if appMode == envProd || appMode == envProduction || appMode == envStaging {
		opts.SetRetryWrites(true).
			SetRetryReads(true)
	}

	client, err := mongo.Connect(opts)
	if err != nil {
		return nil, fmt.Errorf("mongo connect error: %w", err)
	}

	readPref := readpref.Primary()
	if appMode == envDev || appMode == envDevelopment || appMode == envLocal {
		readPref = readpref.PrimaryPreferred()
	}

	pingCtx, pingCancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer pingCancel()

	if err := client.Ping(pingCtx, readPref); err != nil {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cleanupCancel()

		_ = client.Disconnect(cleanupCtx)
		return nil, fmt.Errorf("mongo ping error: %w", err)
	}

	return client, nil
}
