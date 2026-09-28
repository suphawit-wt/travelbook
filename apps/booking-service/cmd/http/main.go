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
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/booking-service/docs"
	"github.com/suphawit-wt/travelbook/apps/booking-service/internal/booking"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/messaging"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/server"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
)

//	@title			Booking Service - Travelbook API
//	@version		1.0.0
//	@description	Booking Service. This service allows users to search for properties, manage bookings.
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

	appLogger := baseLogger.Named("travelbook").Named("booking_service")
	infraLogger := appLogger.Named("infra")
	dbLogger := infraLogger.Named("postgres")
	redisLogger := infraLogger.Named("redis")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "booking_service"),
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

	txManager := database.NewTxManager(pgPool)
	propertyClient := propertyclient.New()

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	bookingRepo := booking.NewRepositoryDB(appLogger.Named("repository"), pgPool, rdb)
	bookingService := booking.NewService(
		appLogger.Named("service"),
		bookingRepo,
		txManager,
		kafkaProducer,
		propertyClient,
	)
	bookingHandler := booking.NewHandler(srv.Validator, bookingService)

	registerRoutes(srv.Router, &cfg.App, bookingHandler)

	serverLogger.Info("http server starting", zap.Int("port", int(cfg.Server.HTTP.Port)))

	if err := srv.Run(ctx); err != nil {
		serverLogger.Error("server exited with error", zap.Error(err))
		return err
	}

	serverLogger.Info("http server gracefully shut down, closing resources and exiting")
	return nil
}

func registerRoutes(router *gin.Engine, cfg *config.AppConfig, bookingHandler booking.Handler) {
	v1 := router.Group("v1")
	bookingsV1 := v1.Group("bookings")

	switch cfg.Mode {
	case "dev", "development", "local":
		docs.SwaggerInfo.Title = cfg.Name
		docs.SwaggerInfo.Description = cfg.Description
		docs.SwaggerInfo.Version = cfg.Version

		bookingsV1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	bookingsV1.GET(":id", bookingHandler.GetBookingByID)
	bookingsV1.POST("", bookingHandler.CreateBooking)
	bookingsV1.PATCH(":id/details", bookingHandler.UpdateBookingDetails)

	// Internal API
	internal := router.Group("internal")

	internalV1 := internal.Group("v1")
	internalV1.GET(":id/total-price-cents", bookingHandler.GetTotalPriceCents)
	internalV1.POST("confirm", bookingHandler.ConfirmBooking)

	router.GET("/health", bookingHandler.HealthCheck)
}
