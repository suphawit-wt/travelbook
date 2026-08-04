// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package userclient

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

const baseURL = "http://user-service:8080"

// Client defines the contract for interacting with the user service HTTP endpoints.
type Client interface {
	GetUserInfo(ctx context.Context, accessToken string) (*UserResponse, error)
}

type client struct {
	baseURL    string
	httpClient *http.Client
}

// New creates and initializes a default user service client instance.
func New() Client {
	return &client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *client) GetUserInfo(
	ctx context.Context,
	accessToken string,
) (*UserResponse, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		c.baseURL+"/v1/users/me",
		http.NoBody,
	)
	if err != nil {
		return nil, fmt.Errorf("client error: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)

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

	var res ApiResponseWithData[UserResponse]
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

	return &res.Data, nil
}
