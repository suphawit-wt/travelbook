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

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/auth"
	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/session"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/passwd"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/vault"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/server"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
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

	appLogger := baseLogger.Named("travelbook").Named("auth_service")
	infraLogger := appLogger.Named("infra")
	dbLogger := infraLogger.Named("postgres")
	redisLogger := infraLogger.Named("redis")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "auth_service"),
		zap.String("mode", string(cfg.App.Mode)),
	)

	pgPool, err := database.NewPostgresPoolClient(cfg.App.Mode, &cfg.DB.Postgres)
	if err != nil {
		return fmt.Errorf("init postgres: %w", err)
	}
	defer func() {
		dbLogger.Info("closing postgres client pool")
		pgPool.Close()
	}()

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

	vaultClient, err := vault.NewClient(cfg.App.Mode, &cfg.Security.Vault)
	if err != nil {
		return fmt.Errorf("init vault client: %w", err)
	}

	jwtKeys, err := jwtkey.LoadJwtKeysFromVault(vaultClient)
	if err != nil {
		return fmt.Errorf("load JWT keys: %w", err)
	}

	jwtSvc := jwt.NewService(cfg.Security.JWT)
	passwordEncoder := passwd.NewArgon2IDEncoder(passwd.DefaultArgon2IDParams())
	txManager := database.NewTxManager(pgPool)

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	sessionRepo := session.NewRepositoryDB(rdb)
	authRepo := auth.NewRepositoryDB(pgPool)
	authService := auth.NewService(
		appLogger.Named("service"),
		&cfg.Auth,
		jwtSvc,
		jwtKeys,
		passwordEncoder,
		kafkaProducer,
		txManager,
		authRepo,
		sessionRepo,
	)
	authHandler := auth.NewHandler(srv.Validator, cfg, jwtKeys, authService)

	registerRoutes(srv.Router, authHandler)

	serverLogger.Info("http server starting", zap.Int("port", int(cfg.Server.HTTP.Port)))

	if err := srv.Run(ctx); err != nil {
		serverLogger.Error("server exited with error", zap.Error(err))
		return err
	}

	serverLogger.Info("http server gracefully shut down, closing resources and exiting")
	return nil
}

func registerRoutes(router *gin.Engine, authHandler auth.Handler) {
	v1 := router.Group("v1")
	authV1 := v1.Group("auth")

	authV1User := authV1.Group("user")
	authV1User.POST("/sign-in", authHandler.UserSignInWithEmail)

	router.GET("/health", authHandler.HealthCheck)
}
