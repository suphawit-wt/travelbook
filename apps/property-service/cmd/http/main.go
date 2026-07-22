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

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/apps/property-service/docs"
	"github.com/suphawit-wt/travelbook/apps/property-service/internal/outbox"
	"github.com/suphawit-wt/travelbook/apps/property-service/internal/property"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/vault"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/server"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/storage"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
	"github.com/suphawit-wt/travelbook/pkg/shared/middleware"
)

//	@title			Property Service - Travelbook API
//	@version		1.0.0
//	@description	Property Service is a microservice that provides property search and filtering functionality.
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

	appLogger := baseLogger.Named("travelbook").Named("property_service")
	infraLogger := appLogger.Named("infra")
	dbLogger := infraLogger.Named("postgres")
	redisLogger := infraLogger.Named("redis")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "property_service"),
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

	s3Client, err := storage.NewS3Client(&cfg.Storage.S3)
	if err != nil {
		return fmt.Errorf("init s3 client: %w", err)
	}

	vaultClient, err := vault.NewClient(cfg.App.Mode, &cfg.Security.Vault)
	if err != nil {
		return fmt.Errorf("init vault client: %w", err)
	}

	jwtKeys, err := jwtkey.LoadJwtKeysFromVault(vaultClient)
	if err != nil {
		return fmt.Errorf("load JWT keys: %w", err)
	}

	jwtSvc := jwt.NewService(cfg.Security.JWT)
	txManager := database.NewTxManager(pgPool)
	s3PresignClient := s3.NewPresignClient(s3Client)

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	outboxRepo := outbox.NewRepositoryDB(pgPool)
	propertyRepo := property.NewRepositoryDB(pgPool, rdb)
	propertyService := property.NewService(
		appLogger.Named("service"),
		&cfg.Storage,
		s3PresignClient,
		propertyRepo,
		outboxRepo,
		txManager,
	)
	propertyHandler := property.NewHandler(srv.Validator, propertyService)

	registerRoutes(srv.Router, &cfg.App, jwtSvc, jwtKeys, propertyHandler)

	serverLogger.Info("http server starting", zap.Int("port", int(cfg.Server.HTTP.Port)))

	if err := srv.Run(ctx); err != nil {
		serverLogger.Error("server exited with error", zap.Error(err))
		return err
	}

	serverLogger.Info("http server gracefully shut down, closing resources and exiting")
	return nil
}

func registerRoutes(
	router *gin.Engine,
	cfg *config.AppConfig,
	jwtSvc jwt.Service,
	jwtKeys *jwtkey.Keys,
	propertyHandler property.Handler,
) {
	v1 := router.Group("v1")
	propertiesV1 := v1.Group("properties")

	switch cfg.Mode {
	case "dev", "development", "local":
		docs.SwaggerInfo.Title = cfg.Name
		docs.SwaggerInfo.Description = cfg.Description
		docs.SwaggerInfo.Version = cfg.Version

		propertiesV1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	authorizedPropertiesV1 := propertiesV1.Use(
		middleware.AuthorizedPartner(jwtSvc, jwtKeys.Partner.Access.Public),
	)
	authorizedPropertiesV1.POST("", propertyHandler.CreateProperty)
	authorizedPropertiesV1.POST(":id/images", propertyHandler.CreatePropertyImages)
	authorizedPropertiesV1.POST(
		":id/images/presigned-urls",
		propertyHandler.GenerateImageUploadURLs,
	)
	authorizedPropertiesV1.POST(":id/rooms", propertyHandler.CreatePropertyRoom)
	authorizedPropertiesV1.PATCH(":id/location", propertyHandler.UpdateLocation)
	authorizedPropertiesV1.PATCH(":id/description", propertyHandler.UpdateDescription)
	authorizedPropertiesV1.PATCH(":id/policies", propertyHandler.UpdatePolicies)

	authorizedPropertiesV1.POST("/rooms/:id/rate-plans", propertyHandler.CreateRatePlan)

	router.GET("health", propertyHandler.HealthCheck)
}
