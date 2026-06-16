// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

// Role represents the role of a user in the system.
type Role string

// Role constants define the different roles available in the system.
const (
	RoleCustomer     Role = "ROLE_CUSTOMER"
	RolePartnerAdmin Role = "ROLE_PARTNER_ADMIN"
	RolePartnerStaff Role = "ROLE_PARTNER_STAFF"
)

func (r Role) String() string {
	return string(r)
}

// ClientType represents the type of client in the system.
type ClientType string

// ClientType constants define the different client types available in the system.
const (
	ClientTypeCustomer ClientType = "CUSTOMER"
	ClientTypePartner  ClientType = "PARTNER"
)

func (c ClientType) String() string {
	return string(c)
}

// OAuthProvider is an enumeration of supported OAuth providers.
type OAuthProvider string

// List of supported OAuth providers.
const (
	OAuthProviderGoogle   OAuthProvider = "google"
	OAuthProviderApple    OAuthProvider = "apple"
	OAuthProviderFacebook OAuthProvider = "facebook"
)

func (o OAuthProvider) String() string {
	return string(o)
}
