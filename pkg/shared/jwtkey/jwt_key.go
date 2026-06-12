// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwtkey

import (
	"context"
	"crypto/rsa"
	"fmt"
	"os"
	"time"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/vault"
)

// KeyPair represents a pair of RSA keys (private and public).
type KeyPair struct {
	Private *rsa.PrivateKey
	Public  *rsa.PublicKey
}

// UserTokens holds the JWT keys for user access and refresh tokens.
type UserTokens struct {
	Access  KeyPair
	Refresh KeyPair
}

// PartnerTokens holds the JWT keys for partner verification, access, and refresh tokens.
type PartnerTokens struct {
	Verify  string
	Access  KeyPair
	Refresh KeyPair
}

// Keys holds all JWT keys for both users and partners.
type Keys struct {
	User    UserTokens
	Partner PartnerTokens
}

// LoadJwtKeysFromVault retrieves JWT keys from Vault and returns a Keys struct.
func LoadJwtKeysFromVault(vaultClient *vault.Client) (*Keys, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userAccess, err := loadKeyPair(ctx, vaultClient, "user-access")
	if err != nil {
		return nil, err
	}

	userRefresh, err := loadKeyPair(ctx, vaultClient, "user-refresh")
	if err != nil {
		return nil, err
	}

	partnerVerifySecretKey, err := vaultClient.Get(ctx, "jwt", "partner-verify", "token")
	if err != nil {
		return nil, fmt.Errorf("vault: partner-verify:token key not found: %w", err)
	}

	partnerAccess, err := loadKeyPair(ctx, vaultClient, "partner-access")
	if err != nil {
		return nil, err
	}

	partnerRefresh, err := loadKeyPair(ctx, vaultClient, "partner-refresh")
	if err != nil {
		return nil, err
	}

	return &Keys{
		User: UserTokens{
			Access:  userAccess,
			Refresh: userRefresh,
		},
		Partner: PartnerTokens{
			Verify:  partnerVerifySecretKey,
			Access:  partnerAccess,
			Refresh: partnerRefresh,
		},
	}, nil
}

// LoadJwtKeysFromSecretManager retrieves JWT keys from Google Cloud Secret Manager and returns a Keys struct.
func LoadJwtKeysFromSecretManager(secretManagerClient *secretmanager.Client) (*Keys, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	projectID := os.Getenv("CLOUD_GCP_PROJECT_ID")

	userAccess, err := loadKeyPairSecretManager(
		ctx,
		secretManagerClient,
		projectID,
		"jwt-user-access",
	)
	if err != nil {
		return nil, err
	}

	userRefresh, err := loadKeyPairSecretManager(
		ctx,
		secretManagerClient,
		projectID,
		"jwt-user-refresh",
	)
	if err != nil {
		return nil, err
	}

	partnerVerifyResp, err := secretManagerClient.AccessSecretVersion(
		ctx,
		&secretmanagerpb.AccessSecretVersionRequest{
			Name: fmt.Sprintf(
				"projects/%s/secrets/jwt-partner-verify-token/versions/latest",
				projectID,
			),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("secretmanager: jwt-partner-verify-token fetch error: %w", err)
	}

	partnerAccess, err := loadKeyPairSecretManager(
		ctx,
		secretManagerClient,
		projectID,
		"jwt-partner-access",
	)
	if err != nil {
		return nil, err
	}

	partnerRefresh, err := loadKeyPairSecretManager(
		ctx,
		secretManagerClient,
		projectID,
		"jwt-partner-refresh",
	)
	if err != nil {
		return nil, err
	}

	return &Keys{
		User: UserTokens{
			Access:  userAccess,
			Refresh: userRefresh,
		},
		Partner: PartnerTokens{
			Verify:  string(partnerVerifyResp.Payload.Data),
			Access:  partnerAccess,
			Refresh: partnerRefresh,
		},
	}, nil
}
