// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

//nolint:tagliatelle // Ignore tagliatelle linter for the entire file due to Elasticsearch payload naming conventions
package search

// IndexPayload represents the document structure stored in the Elasticsearch search index for property search and filtering.
type IndexPayload struct {
	ID        string  `json:"id,omitempty"`
	Name      string  `json:"name,omitempty"`
	Type      string  `json:"type,omitempty"`
	AvgRating float32 `json:"avg_rating,omitempty"`
	Status    string  `json:"status,omitempty"`
}
