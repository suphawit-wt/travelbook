// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package partner

// Status is an enumeration of partner status.
type Status string

// List of Status
const (
	StatusUnverify   Status = "unverify"
	StatusVerified   Status = "verified"
	StatusSoftDelete Status = "soft_delete"
)

// Role is an enumeration of partner role.
type Role string

// List of Role
const (
	RoleOwner Role = "owner"
	RoleAdmin Role = "admin"
)
