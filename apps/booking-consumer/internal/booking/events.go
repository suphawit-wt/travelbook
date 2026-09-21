// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"encoding/json"
	"time"
)

// Timeout represents the structure of a booking timeout message.
type Timeout struct {
	BookingID string `json:"bookingId"`
}

// EventPayload represents the payload of an event, including its metadata and data.
type EventPayload struct {
	Metadata Metadata        `json:"metadata"`
	Data     json.RawMessage `json:"data"`
}

// Metadata represents the metadata of an event, including its ID, correlation ID, type, and creation timestamp.
type Metadata struct {
	EventID       string    `json:"eventId"`
	CorrelationID string    `json:"correlationId"`
	EventType     string    `json:"eventType"`
	CreatedAt     time.Time `json:"createdAt"`
}
