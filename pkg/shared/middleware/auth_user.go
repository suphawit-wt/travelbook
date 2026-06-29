// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package middleware

import (
	"crypto/rsa"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/dto"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/jwt"
)

// AuthorizedUser is middleware for authorize user
func AuthorizedUser(jwtSvc jwt.Service, jwtPublicKey *rsa.PublicKey) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		accessToken := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := jwtSvc.VerifyRS256(accessToken, jwtPublicKey)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.ApiResponse{
				Status:     api.StatusUnauthorized,
				StatusCode: http.StatusUnauthorized,
				Message:    "Access Token is invalid.",
			})
			return
		}

		c.Set("userID", claims.Subject)
		c.Next()
	}
}
