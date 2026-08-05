// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import (
	"encoding/json"
)

// OutboxEvent represents an event in the outbox for event sourcing.
//
//nolint:tagliatelle // Outbox event fields use snake_case by design
type OutboxEvent struct {
	ID            string          `json:"id"`
	AggregateID   string          `json:"aggregate_id"`
	AggregateType string          `json:"aggregate_type"`
	EventType     string          `json:"event_type"`
	Payload       json.RawMessage `json:"payload"`
}
