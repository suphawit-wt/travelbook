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

type esPayload struct {
	From   int           `json:"from"`
	Size   int           `json:"size"`
	Source []string      `json:"_source"`
	Query  esBoolWrapper `json:"query"`
}

type esBoolWrapper struct {
	Bool esBoolQuery `json:"bool"`
}

type esBoolQuery struct {
	Must   []esMatchQuery  `json:"must"`
	Filter []esFilterQuery `json:"filter"`
}

type esMatchQuery struct {
	MultiMatch *esMultiMatch `json:"multi_match,omitempty"`
}

type esMultiMatch struct {
	Query        string   `json:"query"`
	Fields       []string `json:"fields"`
	Type         string   `json:"type"`
	Fuzziness    string   `json:"fuzziness"`
	PrefixLength int      `json:"prefix_length"`
}

type esFilterQuery struct {
	Term  map[string]string       `json:"term,omitempty"`
	Range map[string]esRangeValue `json:"range,omitempty"`
}

type esRangeValue struct {
	Gte any `json:"gte"`
}

type esResponseBody struct {
	Hits esHitsContainer `json:"hits"`
}

type esHitsContainer struct {
	Hits []esHit `json:"hits"`
}

type esHit struct {
	Source esPropertySource `json:"_source"`
}

type esPropertySource struct {
	ID string `json:"id"`
}
