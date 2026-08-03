// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package search

import (
	"context"
	"encoding/json"

	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/database"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the interface for searching related to properties.
type Service interface {
	CreatePropertyIndex(ctx context.Context, propertyDoc *PropertyDocument) error
	UpdatePropertyIndex(ctx context.Context, id string, partialData map[string]any) error
}

type service struct {
	logger *zaplog.Logger
	esBulk *database.BulkIndexer
}

// NewService creates a new instance of searchService with the provided Elasticsearch client.
func NewService(logger *zaplog.Logger, esBulk *database.BulkIndexer) Service {
	return &service{logger: logger, esBulk: esBulk}
}

func (s *service) CreatePropertyIndex(
	ctx context.Context,
	propertyDoc *PropertyDocument,
) error {
	logger := s.logger.Named("create_property_index")

	payload, err := json.Marshal(propertyDoc)
	if err != nil {
		logger.Error("failed to marshal property doc",
			zap.String("propertyID", propertyDoc.ID),
			zap.Error(err),
		)
		return err
	}

	if err := s.esBulk.Add(ctx, propertyDoc.ID, "index", payload); err != nil {
		logger.Error("failed to queue index action",
			zap.String("propertyID", propertyDoc.ID),
			zap.Error(err),
		)
		return err
	}

	return nil
}

func (s *service) UpdatePropertyIndex(
	ctx context.Context,
	id string,
	partialData map[string]any,
) error {
	logger := s.logger.Named("update_property_index")

	updateBody := map[string]any{
		"doc": partialData,
	}

	payload, err := json.Marshal(updateBody)
	if err != nil {
		logger.Error("failed to marshal property doc",
			zap.String("propertyID", id),
			zap.Error(err),
		)
		return err
	}

	if err := s.esBulk.Add(ctx, id, "update", payload); err != nil {
		logger.Error("failed to queue index action",
			zap.String("propertyID", id),
			zap.Error(err),
		)
		return err
	}

	return nil
}
