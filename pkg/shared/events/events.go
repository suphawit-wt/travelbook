// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package events

import "time"

// Metadata represents the metadata of an event.
type Metadata struct {
	EventID       string    `json:"eventId"`
	CorrelationID string    `json:"correlationId"`
	EventType     string    `json:"eventType"`
	CreatedAt     time.Time `json:"createdAt"`
}

// EventPayload represents the payload of an event, including metadata and data.
type EventPayload[T any] struct {
	Metadata Metadata `json:"metadata"`
	Data     T        `json:"data"`
}
