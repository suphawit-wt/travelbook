// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// NewRedisClient creates and initializes a new Redis client instance.
func NewRedisClient(appMode string, cfg *config.RedisConfig) (*redis.Client, error) {
	if cfg.Addr == "" {
		return nil, fmt.Errorf("redis setup error: address cannot be empty")
	}

	appMode = strings.ToLower(appMode)

	poolSize := 10
	if appMode == envProd || appMode == envProduction || appMode == envStaging {
		poolSize = 50
	}

	minIdleConns := 2
	if appMode == envDev || appMode == envDevelopment || appMode == envLocal {
		minIdleConns = 1
	}

	opts := &redis.Options{
		Addr:         cfg.Addr,
		Username:     cfg.Username,
		Password:     cfg.Password,
		DB:           cfg.DB,
		PoolSize:     poolSize,
		MinIdleConns: minIdleConns,

		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,

		ConnMaxIdleTime: 5 * time.Minute,
		ConnMaxLifetime: 30 * time.Minute,
	}

	client := redis.NewClient(opts)

	pingCtx, pingCancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer pingCancel()

	if err := client.Ping(pingCtx).Err(); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("redis ping error: %w", err)
	}

	return client, nil
}
