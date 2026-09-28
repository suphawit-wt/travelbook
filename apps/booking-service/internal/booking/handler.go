// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
	"github.com/suphawit-wt/travelbook/pkg/shared/constants"
)

// Handler defines HTTP request handler methods for bookings.
type Handler interface {
	GetBookingByID(c *gin.Context)
	GetTotalPriceCents(c *gin.Context)
	CreateBooking(c *gin.Context)
	UpdateBookingDetails(c *gin.Context)

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

// GetBookingByID godoc
//
//	@Summary		Get Booking by ID
//	@Description	Retrieve booking details by booking ID
//	@Tags			Bookings
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Booking ID"
//	@Success		200	{object}	ApiResponseWithData{data=GetBookingByIDResponse}
//	@Failure		400	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/bookings/{id} [get]
func (h *handler) GetBookingByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri URI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	bookingID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid booking ID format."))
		return
	}

	currencyCode := c.GetHeader("X-Currency")
	if currencyCode == "" {
		currencyCode = constants.DefaultCurrency
	}

	property, booking, err := h.bookingSvc.GetBookingByID(ctx, bookingID, currencyCode)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	var bookingResponse GetBookingByIDResponse

	res := ApiResponseWithData[*GetBookingByIDResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       bookingResponse.FromDomain(property, booking),
	}

	c.JSON(http.StatusOK, res)
}

func (h *handler) GetTotalPriceCents(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri URI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	bookingID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid booking ID format."))
		return
	}

	totalPriceCents, err := h.bookingSvc.GetTotalPriceCents(ctx, bookingID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[GetTotalPriceCentsResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data: GetTotalPriceCentsResponse{
			TotalPriceCents: totalPriceCents,
		},
	}

	c.JSON(http.StatusOK, res)
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

// UpdateBookingDetails godoc
//
//	@Summary		Update booking details
//	@Description	Partially update booking details by booking ID
//	@Tags			Bookings
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string					true	"Booking ID"
//	@Param			req	body		UpdateBookingRequest	true	"Update booking details"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/bookings/{id}/details [patch]
func (h *handler) UpdateBookingDetails(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri URI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	var req UpdateBookingRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	updateReq, err := req.ToDomain(uri.ID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err := h.bookingSvc.UpdateBookingDetails(ctx, updateReq); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Message:    "Update Booking Details Successfully!",
	}

	c.JSON(http.StatusCreated, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
