// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// NewPostgresPoolClient creates and configures a new PostgreSQL connection pool.
func NewPostgresPoolClient(appMode string, cfg *config.PostgresConfig) (*pgxpool.Pool, error) {
	appMode = strings.ToLower(appMode)

	sslMode := cfg.SSLMode
	if sslMode == "" {
		if appMode == envProd || appMode == envProduction || appMode == envStaging {
			sslMode = "require"
		} else {
			sslMode = "disable"
		}
	}

	queryParams := url.Values{}
	queryParams.Set("sslmode", sslMode)

	if cfg.SSLRootCert != "" {
		queryParams.Set("sslrootcert", cfg.SSLRootCert)
	}

	dbURL := url.URL{
		Scheme:   "postgres",
		User:     url.UserPassword(cfg.User, cfg.Password),
		Host:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Path:     cfg.DbName,
		RawQuery: queryParams.Encode(),
	}

	pgxConfig, err := pgxpool.ParseConfig(dbURL.String())
	if err != nil {
		return nil, fmt.Errorf("postgres parse dsn error: %w", err)
	}

	maxConns := int32(25)
	if appMode == envProd || appMode == envProduction || appMode == envStaging {
		maxConns = 50
	}

	minConns := int32(2)
	if appMode == envDev || appMode == envDevelopment || appMode == envLocal {
		minConns = 1
	}

	pgxConfig.MaxConns = maxConns
	pgxConfig.MinConns = minConns
	pgxConfig.MaxConnIdleTime = 15 * time.Minute
	pgxConfig.MaxConnLifetime = 1 * time.Hour

	connectCtx, connectCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer connectCancel()

	pool, err := pgxpool.NewWithConfig(connectCtx, pgxConfig)
	if err != nil {
		return nil, fmt.Errorf("postgres pool creation error: %w", err)
	}

	pingCtx, pingCancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer pingCancel()

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("postgres ping error: %w", err)
	}

	return pool, nil
}
