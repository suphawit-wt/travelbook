// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
)

// Handler defines HTTP request handler methods for user.
type Handler interface {
	GetUserInfo(c *gin.Context)
	GetNavbarInfo(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt     *validator.Instance
	userSvc Service
}

// NewHandler creates a new instance of Handler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	userSvc Service,
) Handler {
	return &handler{vdt: vdt, userSvc: userSvc}
}

// GetUserInfo godoc
//
//	@Summary		Get user by id
//	@Description	Get a single user by id
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=Response}
//	@Failure		400	{object}	ApiResponse
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me [get]
func (h *handler) GetUserInfo(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	user, err := h.userSvc.GetUserById(ctx, userID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	var userResponse Response

	res := ApiResponseWithData[*Response]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       userResponse.FromEntity(user),
	}

	c.JSON(http.StatusOK, res)
}

// GetNavbarInfo godoc
//
//	@Summary		Get user navbar info
//	@Description	Get a user's navbar info
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=NavbarInfoResponse}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/navbar-info [get]
func (h *handler) GetNavbarInfo(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	navbarInfo, err := h.userSvc.GetNavbarInfo(ctx, userID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*NavbarInfoResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data: &NavbarInfoResponse{
			AvatarURL:  navbarInfo.AvatarURL,
			GeniusTier: navbarInfo.GeniusTier,
		},
	}

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
