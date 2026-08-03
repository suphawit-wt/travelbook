// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package search

import "encoding/json"

// PropertyDocument represents a property document in the system.
//
//nolint:tagliatelle // ES system fields use snake_case by design
type PropertyDocument struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Type              string  `json:"type"`
	AreaNameEN        string  `json:"area_name_en"`
	AreaNameLocal     string  `json:"area_name_local"`
	CityNameEN        string  `json:"city_name_en"`
	CityNameLocal     string  `json:"city_name_local"`
	ProvinceNameEN    string  `json:"province_name_en"`
	ProvinceNameLocal string  `json:"province_name_local"`
	MaxAdults         uint8   `json:"max_adults"`
	MaxChildren       uint8   `json:"max_children"`
	AvgRating         float32 `json:"avg_rating"`
	Status            string  `json:"status"`
}

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
