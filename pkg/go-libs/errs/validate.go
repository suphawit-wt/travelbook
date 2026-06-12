// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package errs

import (
	"reflect"

	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
)

// GinBindAndValidate binds a JSON payload to a request struct and validates its input format.
func GinBindAndValidate(c *gin.Context, req any, vdt *validator.Instance) error {
	enTrans, _ := vdt.Uni.GetTranslator("en")

	if err := c.ShouldBindJSON(&req); err != nil {
		errorMessages := validator.TranslateError(err, enTrans, reflect.TypeOf(req).Elem())
		return NewValidationError("Invalid input format.", errorMessages)
	}

	return nil
}
