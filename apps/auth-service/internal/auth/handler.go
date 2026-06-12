// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
)

// Handler defines HTTP request handler methods for user authentication, partner authentication, and system health checks.
type Handler interface {
	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt *validator.Instance
	cfg *config.Config
}

// NewHandler creates a new instance of AuthHandler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	cfg *config.Config,
) Handler {
	return &handler{vdt: vdt, cfg: cfg}
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
