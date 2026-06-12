// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package passwd

import "github.com/stretchr/testify/mock"

// EncoderMock is a mock implementation of the Encoder interface for unit testing.
type EncoderMock struct {
	mock.Mock
}

// NewEncoderMock creates a new mock instance of the Encoder.
func NewEncoderMock() *EncoderMock {
	return &EncoderMock{}
}

// Hash provides a mocked implementation of the Hash method.
func (m *EncoderMock) Hash(password string) (string, error) {
	args := m.Called(password)
	return args.String(0), args.Error(1)
}

// Verify provides a mocked implementation of the Verify method.
func (m *EncoderMock) Verify(hash, password string) (bool, error) {
	args := m.Called(hash, password)
	return args.Bool(0), args.Error(1)
}
