// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
)

// Handler defines HTTP request handler methods for user authentication, partner authentication, and system health checks.
type Handler interface {
	UserSignInWithEmail(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt     *validator.Instance
	cfg     *config.Config
	jwtKeys *jwtkey.Keys
	svc     Service
}

// NewHandler creates a new instance of AuthHandler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	cfg *config.Config,
	jwtKeys *jwtkey.Keys,
	svc Service,
) Handler {
	return &handler{vdt: vdt, cfg: cfg, jwtKeys: jwtKeys, svc: svc}
}

// UserSignInWithEmail godoc
//
//	@Summary		Sign in user
//	@Description	Authenticate user and return access + refresh token
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UserSignInRequest	true	"User credentials"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/sign-in [post]
func (h *handler) UserSignInWithEmail(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req UserSignInRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err := h.svc.UserSignInWithEmail(ctx, req.Email); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "OTP was sent to the user's email.",
	}

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
