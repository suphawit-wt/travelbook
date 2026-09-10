// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
	"github.com/suphawit-wt/travelbook/pkg/shared/constants"
)

// Handler defines HTTP request handler methods for bookings.
type Handler interface {
	CreateBooking(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt        *validator.Instance
	bookingSvc Service
}

// NewHandler creates a new instance of Handler.
func NewHandler(
	vdt *validator.Instance,
	bookingSvc Service,
) Handler {
	return &handler{vdt: vdt, bookingSvc: bookingSvc}
}

// CreateBooking godoc
//
//	@Summary		Create booking
//	@Description	Create a new booking for a user
//	@Tags			Bookings
//	@Accept			json
//	@Produce		json
//	@Param			req	body		CreateBookingRequest	true	"Booking creation payload"
//	@Success		201	{object}	ApiResponseWithData{data=CreateBookingResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/bookings [post]
func (h *handler) CreateBooking(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	req := CreateBookingRequest{}

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	currencyCode := c.GetHeader("X-Currency")
	if currencyCode == "" {
		currencyCode = constants.DefaultCurrency
	}

	createReq, err := req.ToDomain(currencyCode)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	booking, err := h.bookingSvc.CreateBooking(ctx, createReq)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*CreateBookingResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Data: &CreateBookingResponse{
			BookingID: booking.BookingID,
			ExpiresAt: booking.ExpiresAt,
		},
	}

	c.JSON(http.StatusCreated, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
