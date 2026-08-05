// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
	"github.com/suphawit-wt/travelbook/pkg/userclient"
)

// Handler defines HTTP request handler methods for reviews.
type Handler interface {
	GetReviewsByPropertyID(c *gin.Context)
	CreateReview(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt        *validator.Instance
	reviewSvc  Service
	userClient userclient.Client
}

// NewHandler creates a new instance of Handler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	reviewSvc Service,
	userClient userclient.Client,
) Handler {
	return &handler{vdt: vdt, reviewSvc: reviewSvc, userClient: userClient}
}

// GetReviewsByPropertyID godoc
//
//	@Summary		Get reviews by property ID
//	@Description	Get reviews associated with a specific property
//	@Tags			Reviews
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=[]Response}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/reviews/properties/{id} [get]
func (h *handler) GetReviewsByPropertyID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri GetReviewsByPropertyIDURI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	reviews, err := h.reviewSvc.GetReviewsByPropertyID(ctx, propertyID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	var response Response
	res := ApiResponseWithData[[]Response]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       response.FromDomainList(reviews),
	}

	c.JSON(http.StatusOK, res)
}

// CreateReview godoc
//
//	@Summary		Create review by user
//	@Description	Create review by user
//	@Tags			Reviews
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		CreateReviewRequest	true	"CreateReviewRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/reviews [post]
func (h *handler) CreateReview(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	authHeader := c.GetHeader("Authorization")
	accessToken := strings.TrimPrefix(authHeader, "Bearer ")

	user, err := h.userClient.GetUserInfo(ctx, accessToken)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

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

	var req CreateReviewRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	reviewReq, err := req.ToDomain(userID, user.DisplayName, user.Address.CountryCode)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	review, err := h.reviewSvc.CreateReview(ctx, reviewReq)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	var response Response
	res := ApiResponseWithData[*Response]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Data:       response.FromDomain(review),
	}

	c.JSON(http.StatusCreated, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
