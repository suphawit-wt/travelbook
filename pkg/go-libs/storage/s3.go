// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
)

// NewS3Client initializes and configures an AWS S3 client using static credentials and custom endpoint options.
func NewS3Client(cfg *config.S3Config) (*s3.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	cfgAws, err := awscfg.LoadDefaultConfig(
		ctx,
		awscfg.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(cfg.AccessKey, cfg.SecretKey, ""),
		),
		awscfg.WithRegion(cfg.Region),
	)
	if err != nil {
		return nil, fmt.Errorf("s3 error: %w", err)
	}

	client := s3.NewFromConfig(cfgAws, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(cfg.Endpoint)
	})

	return client, nil
}
