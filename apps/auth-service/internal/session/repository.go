// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package session

import (
	"context"
	"crypto/subtle"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Repository defines the data access contract for jwt tokens sessions.
type Repository interface {
	SaveOTP(ctx context.Context, otpKey, otpValue string, ttl time.Duration) error
	VerifyOTP(ctx context.Context, otpKey, otpValue string) (bool, error)
	DeleteOTP(ctx context.Context, otpKey string) (bool, error)
}

type repositoryDB struct {
	rdb *redis.Client
}

// NewRepositoryDB creates a new instance of tokenRepositoryDB with the provided Redis client.
func NewRepositoryDB(rdb *redis.Client) Repository {
	return &repositoryDB{rdb: rdb}
}

func (r *repositoryDB) SaveOTP(
	ctx context.Context,
	otpKey, otpValue string,
	ttl time.Duration,
) error {
	if err := r.rdb.Set(ctx, otpKey, otpValue, ttl).Err(); err != nil {
		return fmt.Errorf(
			"sessionRepo.SaveOTP: failed to save otp for key %s: %w",
			otpKey,
			err,
		)
	}

	return nil
}

func (r *repositoryDB) VerifyOTP(
	ctx context.Context,
	otpKey, otpValue string,
) (bool, error) {
	storedOTP, err := r.rdb.Get(ctx, otpKey).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return false, ErrTokenNotFound
		}

		return false, err
	}

	if subtle.ConstantTimeCompare([]byte(storedOTP), []byte(otpValue)) != 1 {
		return false, nil
	}

	if err := r.rdb.Del(ctx, otpKey).Err(); err != nil {
		return false, err
	}

	return true, nil
}

func (r *repositoryDB) DeleteOTP(
	ctx context.Context,
	otpKey string,
) (bool, error) {
	deletedCount, err := r.rdb.Del(ctx, otpKey).Result()
	if err != nil {
		return false, fmt.Errorf(
			"sessionRepo.DeleteOTP: failed to detele otp for key %s: %w",
			otpKey,
			err,
		)
	}

	return deletedCount > 0, nil
}
