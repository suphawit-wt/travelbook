// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"

	"github.com/elastic/go-elasticsearch/v9"
)

// Repository defines the data access contract for property search operations.
type Repository interface {
	SearchRawIDs(
		ctx context.Context,
		destination string,
		propertyType string,
		adults, children uint8,
		minRating float32,
		page int,
		perPage int,
	) ([]string, error)
}

type repositoryDB struct {
	esClient *elasticsearch.Client
}

// NewRepositoryDB creates a new instance of Repository using the provided Elasticsearch client.
func NewRepositoryDB(esClient *elasticsearch.Client) Repository {
	return &repositoryDB{esClient: esClient}
}

// SearchRawIDs queries Elasticsearch for property IDs matching destination, guest counts, rating, and filters.
func (r *repositoryDB) SearchRawIDs(
	ctx context.Context,
	destination, propertyType string,
	adults, children uint8,
	minRating float32,
	page, perPage int,
) ([]string, error) {
	mustQueries := make([]esMatchQuery, 0, 1)
	if destination != "" {
		mustQueries = append(mustQueries, esMatchQuery{
			MultiMatch: &esMultiMatch{
				Query: destination,
				Fields: []string{
					"name^3", "name.en^3",
					"area_name_en", "area_name_local",
					"city_name_en", "city_name_local",
					"province_name_en", "province_name_local",
				},
				Type:         "best_fields",
				Fuzziness:    "AUTO:3,6",
				PrefixLength: 2,
			},
		})
	}

	filterQueries := []esFilterQuery{
		{Term: map[string]string{"status": "active"}},
		{Range: map[string]esRangeValue{"max_adults": {Gte: adults}}},
		{Range: map[string]esRangeValue{"max_children": {Gte: children}}},
	}

	if propertyType != "" {
		filterQueries = append(filterQueries, esFilterQuery{
			Term: map[string]string{"type.keyword": propertyType},
		})
	}

	if minRating > 0 {
		filterQueries = append(filterQueries, esFilterQuery{
			Range: map[string]esRangeValue{"avg_rating": {Gte: minRating}},
		})
	}

	offset := (page - 1) * perPage

	searchSize := perPage
	if searchSize < 20 {
		searchSize = 20
	}

	payload := esPayload{
		From:   offset,
		Size:   searchSize,
		Source: []string{"id"},
		Query: esBoolWrapper{
			Bool: esBoolQuery{
				Must:   mustQueries,
				Filter: filterQueries,
			},
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to encode ES query: %w", err)
	}

	res, err := r.esClient.Search(
		r.esClient.Search.WithContext(ctx),
		r.esClient.Search.WithIndex("search_properties"),
		r.esClient.Search.WithBody(bytes.NewReader(bodyBytes)),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to execute ES search: %w", err)
	}
	defer func() {
		_ = res.Body.Close()
	}()

	if res.IsError() {
		errBody, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf(
			"elasticsearch error response [status %s]: %s",
			res.Status(),
			string(errBody),
		)
	}

	var esResponse esResponseBody
	if err := json.NewDecoder(res.Body).Decode(&esResponse); err != nil {
		return nil, fmt.Errorf("failed to decode ES response body: %w", err)
	}

	hits := esResponse.Hits.Hits
	if len(hits) == 0 {
		return []string{}, nil
	}

	propertyIDs := make([]string, len(hits))
	for i := range hits {
		propertyIDs[i] = hits[i].Source.ID
	}

	return propertyIDs, nil
}
