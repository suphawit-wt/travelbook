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

	"github.com/suphawit-wt/travelbook/apps/user-service/docs"
	"github.com/suphawit-wt/travelbook/apps/user-service/internal/user"
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

//	@title			User Service - Travelbook API
//	@version		1.0.0
//	@description	User Service manages user identities, profiles, and access control within the TravelBook ecosystem.
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

	appLogger := baseLogger.Named("travelbook").Named("user_service")
	infraLogger := appLogger.Named("infra")
	dbLogger := infraLogger.Named("postgres")
	serverLogger := appLogger.Named("http")

	appLogger.Info("starting microservice initialization",
		zap.String("service", "user_service"),
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

	srv, err := server.NewHTTPGin(cfg, serverLogger)
	if err != nil {
		return fmt.Errorf("init http server: %w", err)
	}

	userRepo := user.NewRepositoryDB(pgPool)
	userService := user.NewService(appLogger.Named("service"), &cfg.Storage, s3Client, userRepo)
	userHandler := user.NewHandler(srv.Validator, userService)

	registerRoutes(srv.Router, &cfg.App, jwtSvc, jwtKeys, userHandler)

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
	userHandler user.Handler,
) {
	v1 := router.Group("v1")
	usersV1 := v1.Group("users")

	switch cfg.Mode {
	case "dev", "development", "local":
		docs.SwaggerInfo.Title = cfg.Name
		docs.SwaggerInfo.Description = cfg.Description
		docs.SwaggerInfo.Version = cfg.Version

		usersV1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	authorizedUsersV1 := v1.Group("users").
		Use(middleware.AuthorizedUser(jwtSvc, jwtKeys.User.Access.Public))
	authorizedUsersV1.GET("/me", userHandler.GetUserInfo)
	authorizedUsersV1.GET("/navbar-info", userHandler.GetNavbarInfo)
	authorizedUsersV1.POST("/me/avatar", userHandler.UploadAvatar)
	authorizedUsersV1.PATCH("/me/name", userHandler.UpdateName)
	authorizedUsersV1.PATCH("/me/display-name", userHandler.UpdateDisplayName)
	authorizedUsersV1.PATCH("/me/phone-number", userHandler.UpdatePhoneNumber)
	authorizedUsersV1.PATCH("/me/date-of-birth", userHandler.UpdateDateOfBirth)
	authorizedUsersV1.PATCH("/me/nationality", userHandler.UpdateNationality)
	authorizedUsersV1.PATCH("/me/gender", userHandler.UpdateGender)
	authorizedUsersV1.PATCH("/me/address", userHandler.UpdateAddress)
	authorizedUsersV1.PATCH("/me/passport-details", userHandler.UpdatePassportDetails)

	router.GET("/health", userHandler.HealthCheck)
}
