// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package propertyclient

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	enums "github.com/suphawit-wt/travelbook/pkg/go-libs/enums/http"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

const baseURL = "http://property-service:8080"

// Client defines the contract for interacting with property service HTTP endpoints.
type Client interface {
	Reserve(ctx context.Context, req *ReserveRequest) (*ReserveResponse, error)
	Release(ctx context.Context, req *ReleaseBookingRequest) error
}

type client struct {
	baseURL    string
	httpClient *http.Client
}

// New creates and initializes a default property service client instance.
func New() Client {
	return &client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *client) Reserve(
	ctx context.Context,
	req *ReserveRequest,
) (*ReserveResponse, error) {
	var bodyReq bytes.Buffer
	if err := json.NewEncoder(&bodyReq).Encode(req); err != nil {
		return nil, fmt.Errorf("client error marshalling request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/internal/v1/"+req.PropertyID.String()+"/reserve",
		&bodyReq,
	)
	if err != nil {
		return nil, fmt.Errorf("client error: %w", err)
	}
	httpReq.Header.Set("Content-Type", enums.ContentTypeJSON)
	httpReq.Header.Set("X-Currency", req.CurrencyCode)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return nil, errs.NewRequestTimeOutError("Request Time out.")
		}
		return nil, fmt.Errorf("client error: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	var res ApiResponseWithData[*ReserveResponse]
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("client error: %w", err)
	}

	switch res.StatusCode {
	case 400:
		return nil, errs.NewBadRequestError(res.Message)
	case 404:
		return nil, errs.NewNotFoundError(res.Message)
	case 500:
		return nil, errs.NewUnexpectedError()
	}

	return res.Data, nil
}

func (c *client) Release(
	ctx context.Context,
	req *ReleaseBookingRequest,
) error {
	var bodyReq bytes.Buffer
	if err := json.NewEncoder(&bodyReq).Encode(req); err != nil {
		return fmt.Errorf("client error marshalling request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/internal/v1/release",
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
