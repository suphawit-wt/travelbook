// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package dberr

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
)

// ValidatePostgresError checks if the provided error is a PostgreSQL error and returns APP error.
func ValidatePostgresError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505": // unique_violation
			switch pgErr.ConstraintName {
			case "auth_credentials_email_key":
				return errs.NewConflictError("Email already exists.")

			case "auth_credentials_username_key":
				return errs.NewConflictError("Username already exists.")

			case "auth_credentials_phone_number_key", "partners_phone_number_key":
				return errs.NewConflictError("Phone number already exists.")

			default:
				return errs.NewConflictError("Duplicate record.")
			}

		case "23503": // foreign_key_violation
			return errs.NewConflictError("Invalid reference.")

		case "23502": // not_null_violation
			return errs.NewBadRequestError("Missing required field.")
		}
	}

	return errs.NewUnexpectedError()
}
