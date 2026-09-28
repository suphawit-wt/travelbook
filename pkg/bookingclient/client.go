// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package bookingclient

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"

	enums "github.com/suphawit-wt/travelbook/pkg/go-libs/enums/http"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

const baseURL = "http://booking-service:8080"

// Client defines the contract for interacting with booking service HTTP endpoints.
type Client interface {
	GetTotalPriceCents(
		ctx context.Context,
		bookingID uuid.UUID,
	) (int64, error)
	ConfirmBooking(ctx context.Context, bookingID uuid.UUID) error
}

type client struct {
	baseURL    string
	httpClient *http.Client
}

// New creates and initializes a default booking service client instance.
func New() Client {
	return &client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *client) GetTotalPriceCents(
	ctx context.Context,
	bookingID uuid.UUID,
) (int64, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		c.baseURL+"/internal/v1/"+bookingID.String()+"/total-price-cents",
		http.NoBody,
	)
	if err != nil {
		return 0, fmt.Errorf("client error: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return 0, errs.NewRequestTimeOutError("Request Time out.")
		}
		return 0, fmt.Errorf("client error: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	var res ApiResponseWithData[GetTotalPriceCentsResponse]
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return 0, fmt.Errorf("client error: %w", err)
	}

	switch res.StatusCode {
	case 400:
		return 0, errs.NewBadRequestError(res.Message)
	case 404:
		return 0, nil
	case 500:
		return 0, errs.NewUnexpectedError()
	}

	return res.Data.TotalPriceCents, nil
}

func (c *client) ConfirmBooking(ctx context.Context, bookingID uuid.UUID) error {
	req := ConfirmBookingRequest{
		BookingID: bookingID.String(),
	}

	var bodyReq bytes.Buffer
	if err := json.NewEncoder(&bodyReq).Encode(req); err != nil {
		return fmt.Errorf("client error: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/internal/v1/confirm",
		&bodyReq,
	)
	if err != nil {
		return fmt.Errorf("client error: %w", err)
	}
	httpReq.Header.Set("Content-Type", enums.ContentTypeJSON)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return errs.NewRequestTimeOutError("Request Time out.")
		}
		return fmt.Errorf("client error: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	var res ApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return fmt.Errorf("client error: %w", err)
	}

	switch res.StatusCode {
	case 400:
		return errs.NewBadRequestError(res.Message)
	case 404:
		return errs.NewNotFoundError(res.Message)
	case 500:
		return errs.NewUnexpectedError()
	}

	return nil
}
