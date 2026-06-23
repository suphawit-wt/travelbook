// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package email

import (
	"encoding/json"
	"time"
)

// Metadata represents the metadata associated with an event, including its unique identifier, correlation ID, event type, and creation timestamp.
type Metadata struct {
	EventID       string    `json:"eventId"`
	CorrelationID string    `json:"correlationId"`
	EventType     string    `json:"eventType"`
	CreatedAt     time.Time `json:"createdAt"`
}

// EventPayload represents the structure of an event payload, containing metadata and associated data.
type EventPayload struct {
	Metadata Metadata        `json:"metadata"`
	Data     json.RawMessage `json:"data"`
}

// OTPPayload represents the structure of the OTP payload, containing the email and the generated OTP.
type OTPPayload struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}
