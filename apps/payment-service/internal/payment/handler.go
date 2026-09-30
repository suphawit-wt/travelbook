// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package payment

import (
	"context"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
)

// Handler defines HTTP request handler methods for payment.
type Handler interface {
	CreateBookingPaymentIntent(c *gin.Context)
	StripeWebhook(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt        *validator.Instance
	paymentSvc Service
}

// NewHandler creates a new instance of Handler.
func NewHandler(
	vdt *validator.Instance,
	paymentSvc Service,
) Handler {
	return &handler{vdt: vdt, paymentSvc: paymentSvc}
}

// CreateBookingPaymentIntent godoc
//
//	@Summary		Create booking payment intent
//	@Description	Returns a client secret used to complete the payment.
//	@Tags			Payments
//	@Accept			json
//	@Produce		json
//	@Param			req	body		CreateBookingPaymentIntentRequest	true	"Booking payments intent creation payload"
//	@Success		201	{object}	ApiResponseWithData{data=CreatePaymentIntentResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/payments/intents [post]
func (h *handler) CreateBookingPaymentIntent(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	req := CreateBookingPaymentIntentRequest{}

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	bookingID, err := uuid.Parse(req.BookingID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid booking ID format."))
		return
	}

	clientSecret, err := h.paymentSvc.CreatePaymentIntent(ctx, bookingID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[CreatePaymentIntentResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Data: CreatePaymentIntentResponse{
			ClientSecret: clientSecret,
		},
	}

	c.JSON(http.StatusCreated, res)
}

// StripeWebhook godoc
//
//	@Summary		Create booking payment intent
//	@Description	Returns a client secret used to complete the payment.
//	@Tags			Payments
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/payments/webhooks/stripe [post]
func (h *handler) StripeWebhook(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	const MaxBodyBytes = int64(65536)
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxBodyBytes)

	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Println("Error reading body:", err)
		errs.GinHandleError(c, errs.NewBadRequestError("Error reading body"))
		return
	}

	if err := h.paymentSvc.StripeWebhook(
		ctx,
		payload,
		c.GetHeader("Stripe-Signature"),
	); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Stripe Webhook received",
	}

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
