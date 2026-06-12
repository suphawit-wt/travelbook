// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package jwtkey

import (
	"context"
	"fmt"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/security/vault"
)

func loadKeyPair(
	ctx context.Context,
	vaultClient *vault.Client,
	path string,
) (KeyPair, error) {
	privStr, err := vaultClient.Get(ctx, "jwt", path, "private")
	if err != nil {
		return KeyPair{}, fmt.Errorf("vault: %s:private fetch error: %w", path, err)
	}
	privKey, err := parseRSAPrivateKey(privStr)
	if err != nil {
		return KeyPair{}, fmt.Errorf("vault: %s:private parse error: %w", path, err)
	}

	pubStr, err := vaultClient.Get(ctx, "jwt", path, "public")
	if err != nil {
		return KeyPair{}, fmt.Errorf("vault: %s:public fetch error: %w", path, err)
	}
	pubKey, err := parseRSAPublicKey(pubStr)
	if err != nil {
		return KeyPair{}, fmt.Errorf("vault: %s:public parse error: %w", path, err)
	}

	return KeyPair{
		Private: privKey,
		Public:  pubKey,
	}, nil
}

func loadKeyPairSecretManager(
	ctx context.Context,
	client *secretmanager.Client,
	projectID string,
	secretPrefix string,
) (KeyPair, error) {
	privSecretName := fmt.Sprintf(
		"projects/%s/secrets/%s-private/versions/latest",
		projectID,
		secretPrefix,
	)
	privResp, err := client.AccessSecretVersion(ctx, &secretmanagerpb.AccessSecretVersionRequest{
		Name: privSecretName,
	})
	if err != nil {
		return KeyPair{}, fmt.Errorf("secretmanager: %s-private fetch error: %w", secretPrefix, err)
	}

	privKey, err := parseRSAPrivateKey(string(privResp.Payload.Data))
	if err != nil {
		return KeyPair{}, fmt.Errorf("secretmanager: %s-private parse error: %w", secretPrefix, err)
	}

	pubSecretName := fmt.Sprintf(
		"projects/%s/secrets/%s-public/versions/latest",
		projectID,
		secretPrefix,
	)
	pubResp, err := client.AccessSecretVersion(ctx, &secretmanagerpb.AccessSecretVersionRequest{
		Name: pubSecretName,
	})
	if err != nil {
		return KeyPair{}, fmt.Errorf("secretmanager: %s-public fetch error: %w", secretPrefix, err)
	}

	pubKey, err := parseRSAPublicKey(string(pubResp.Payload.Data))
	if err != nil {
		return KeyPair{}, fmt.Errorf("secretmanager: %s-public parse error: %w", secretPrefix, err)
	}

	return KeyPair{
		Private: privKey,
		Public:  pubKey,
	}, nil
}
