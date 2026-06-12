// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package database

import (
	"context"
	"fmt"
	"strings"
	"time"

	gocql "github.com/apache/cassandra-gocql-driver/v2"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// NewCassandraSession creates and initializes a new Cassandra cluster session.
func NewCassandraSession(appMode string, cfg *config.CassandraConfig) (*gocql.Session, error) {
	if len(cfg.Hosts) == 0 {
		return nil, fmt.Errorf("cassandra setup error: no seed hosts provided")
	}

	cluster := gocql.NewCluster(cfg.Hosts...)

	cluster.Keyspace = cfg.Keyspace
	if cfg.Port != 0 {
		cluster.Port = cfg.Port
	}

	switch strings.ToLower(appMode) {
	case envProd, envProduction, envStaging:
		if cfg.LocalDC == "" {
			return nil, fmt.Errorf(
				"cassandra setup error: local_dc is required for %s mode",
				appMode,
			)
		}

		cluster.ProtoVersion = 4
		cluster.Consistency = gocql.LocalQuorum
		cluster.DisableInitialHostLookup = false

		cluster.PoolConfig.HostSelectionPolicy = gocql.TokenAwareHostPolicy(
			gocql.DCAwareRoundRobinPolicy(cfg.LocalDC),
			gocql.ShuffleReplicas(),
		)

	case envDev, envDevelopment, envLocal:
		cluster.Consistency = gocql.One
		cluster.PoolConfig.HostSelectionPolicy = gocql.RoundRobinHostPolicy()

	default:
		return nil, fmt.Errorf(
			"cassandra setup error: invalid env %q (must be dev, staging, or prod)",
			appMode,
		)
	}

	cluster.ConnectTimeout = 5 * time.Second
	if cfg.ConnectTimeout > 0 {
		cluster.ConnectTimeout = cfg.ConnectTimeout
	}

	cluster.Timeout = 3 * time.Second
	if cfg.Timeout > 0 {
		cluster.Timeout = cfg.Timeout
	}

	if cfg.NumConns > 0 {
		cluster.NumConns = cfg.NumConns
	} else {
		cluster.NumConns = 2
	}

	cluster.RetryPolicy = &gocql.ExponentialBackoffRetryPolicy{
		NumRetries: 3,
		Min:        100 * time.Millisecond,
		Max:        1 * time.Second,
	}

	cluster.ReconnectionPolicy = &gocql.ExponentialReconnectionPolicy{
		MaxRetries:      5,
		InitialInterval: 500 * time.Millisecond,
		MaxInterval:     10 * time.Second,
	}

	if cfg.Username != "" {
		cluster.Authenticator = gocql.PasswordAuthenticator{
			Username: cfg.Username,
			Password: cfg.Password,
		}
	}

	if cfg.CertPath != "" {
		cluster.SslOpts = &gocql.SslOptions{
			CaPath:                 cfg.CertPath,
			EnableHostVerification: false,
		}
	}

	session, err := cluster.CreateSession()
	if err != nil {
		return nil, fmt.Errorf("cassandra connect error: %w", err)
	}

	pingCtx, pingCancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer pingCancel()

	if err := session.Query("SELECT cluster_name FROM system.local LIMIT 1").
		ExecContext(pingCtx); err != nil {
		session.Close()
		return nil, fmt.Errorf("cassandra ping verification error: %w", err)
	}

	return session, nil
}
