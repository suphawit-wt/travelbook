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
	"github.com/stripe/stripe-go/v86"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/payment-service/docs"
	"github.com/suphawit-wt/travelbook/apps/payment-service/internal/payment"
	"github.com/suphawit-wt/travelbook/pkg/bookingclient"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/server"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

//	@title			Payment Service - Travelbook API
//	@version		1.0.0
//	@description	Payment Service. This service allows users to process payments securely.
//	@termsOfService	https://suphawit.dev/terms/

//	@contact.name	Suphawit Watthanataetakun
//	@contact.url	https://suphawit.dev/support
//	@contact.email	support@suphwit.dev

//	@license.name	Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
//	@license.url	https://creativecommons.org/licenses/by-nc-nd/4.0

//	@host		api.travelbook.localhost
//	@BasePath	/

//	@securityDefinitions.apikey	Bearer
//	@in							header
//	@name						Authorization
//	@description				Put **_ONLY_** your JWT Bearer token in textbox below

// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
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

	appLogger := baseLogger.Named("travelbook").Named("payment_service")
	infraLogger := appLogger.Named("infra")
	dbLogger := infraLogger.Named("postgres")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "payment_service"),
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

	bookingClient := bookingclient.New()

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	stripe.Key = cfg.Payment.Stripe.SecretKey

	paymentRepo := payment.NewRepositoryDB(pgPool)
	paymentService := payment.NewService(
		appLogger.Named("service"),
		&cfg.Payment,
		paymentRepo,
		bookingClient,
	)
	paymentHandler := payment.NewHandler(srv.Validator, paymentService)

	registerRoutes(srv.Router, &cfg.App, paymentHandler)

	serverLogger.Info("http server starting", zap.Int("port", int(cfg.Server.HTTP.Port)))

	if err := srv.Run(ctx); err != nil {
		serverLogger.Error("server exited with error", zap.Error(err))
		return err
	}

	serverLogger.Info("http server gracefully shut down, closing resources and exiting")
	return nil
}

func registerRoutes(router *gin.Engine, cfg *config.AppConfig, paymentHandler payment.Handler) {
	v1 := router.Group("v1")
	paymentsV1 := v1.Group("payments")

	switch cfg.Mode {
	case "dev", "development", "local":
		docs.SwaggerInfo.Title = cfg.Name
		docs.SwaggerInfo.Description = cfg.Description
		docs.SwaggerInfo.Version = cfg.Version

		paymentsV1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}
	paymentsV1.POST("/intents", paymentHandler.CreateBookingPaymentIntent)

	router.GET("/health", paymentHandler.HealthCheck)
}
