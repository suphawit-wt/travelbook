// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

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

// Handler defines the HTTP interface for handling property-related HTTP requests.
type Handler interface {
	CreateProperty(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt         *validator.Instance
	propertySvc Service
}

// NewHandler creates a new instance of Handler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	propertySvc Service,
) Handler {
	return &handler{vdt: vdt, propertySvc: propertySvc}
}

// CreateProperty godoc
//
//	@Summary		Create property
//	@Description	Create a new property
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		CreatePropertyRequest	true	"CreatePropertyRequest"
//	@Success		201	{object}	ApiResponseWithData{data=CreatePropertyResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties [post]
func (h *handler) CreateProperty(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	partnerIDStr, ok := c.MustGet("partnerID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	partnerID, err := uuid.Parse(partnerIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	var req CreatePropertyRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	createReq, err := req.ToDomain(partnerID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	property, err := h.propertySvc.CreateProperty(ctx, createReq)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*CreatePropertyResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Data: &CreatePropertyResponse{
			Id:       property.ID.String(),
			Name:     property.Name,
			Slug:     property.Slug,
			Type:     property.Type,
			Timezone: property.Timezone,
		},
	}

	c.JSON(http.StatusCreated, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
