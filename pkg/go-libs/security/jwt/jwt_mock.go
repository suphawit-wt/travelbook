// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwt

import (
	"github.com/stretchr/testify/mock"
)

// ServiceMock is a mock implementation of the JWT Service for testing.
type ServiceMock struct {
	mock.Mock
}

// NewServiceMock creates a new instance of ServiceMock.
func NewServiceMock() *ServiceMock {
	return &ServiceMock{}
}
