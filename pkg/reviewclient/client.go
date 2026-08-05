// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package reviewclient

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

const baseURL = "http://review-service:8080"

// Client defines the contract for interacting with review service HTTP endpoints.
type Client interface {
	GetReviewsByPropertyID(ctx context.Context, propertyID string) ([]ReviewResponse, error)
}

type client struct {
	baseURL    string
	httpClient *http.Client
}

// New creates and initializes a default review service client instance.
func New() Client {
	return &client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *client) GetReviewsByPropertyID(
	ctx context.Context,
	propertyID string,
) ([]ReviewResponse, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		c.baseURL+"/v1/reviews/properties/"+propertyID,
		http.NoBody,
	)
	if err != nil {
		return nil, fmt.Errorf("client error: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return nil, errs.NewRequestTimeOutError("Request Time out.")
		}
		return nil, fmt.Errorf("client error: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	var res ApiResponseWithData[[]ReviewResponse]
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("client error: %w", err)
	}

	switch res.StatusCode {
	case 400:
		return nil, errs.NewBadRequestError(res.Message)
	case 401:
		return nil, errs.NewUnauthorizedError(res.Message)
	case 404:
		return nil, errs.NewNotFoundError(res.Message)
	case 500:
		return nil, errs.NewUnexpectedError()
	}

	return res.Data, nil
}
