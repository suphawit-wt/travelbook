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

	"github.com/gin-gonic/gin"
	"github.com/suphawit-wt/travelbook/apps/auth-service/internal/auth"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/server"
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

	appLogger := baseLogger.Named("travelbook").Named("auth_service")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "auth_service"),
		zap.String("mode", string(cfg.App.Mode)),
	)

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	authHandler := auth.NewHandler(srv.Validator, cfg)

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
	router.GET("/health", authHandler.HealthCheck)
}
