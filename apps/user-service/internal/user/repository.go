// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Address represents the user's address information.
type Address struct {
	CountryCode  string
	AddressLine1 string
	City         string
	ZipCode      string
}

// PassportDetails represents the user's passport information.
type PassportDetails struct {
	FirstName      string
	LastName       string
	PassportNumber string
	IssueCountry   string
	ExpireDate     time.Time
}

// Repository defines the data access contract for user entities.
type Repository interface {
	GetById(ctx context.Context, id uuid.UUID) (user *User, found bool, err error)
	UpdateAvatar(ctx context.Context, id uuid.UUID, avatarKey, avatarUrl string) error
	UpdateName(ctx context.Context, id uuid.UUID, firstName, lastName string) error
	UpdateDisplayName(ctx context.Context, id uuid.UUID, displayName string) error
	UpdatePhoneNumber(ctx context.Context, id uuid.UUID, phoneNumber string) error
	UpdateDateOfBirth(ctx context.Context, id uuid.UUID, dateOfBirth time.Time) error
	UpdateNationality(ctx context.Context, id uuid.UUID, nationality string) error
	UpdateGender(ctx context.Context, id uuid.UUID, gender string) error
	UpdateAddress(ctx context.Context, id uuid.UUID, addr *Address) error
	UpdatePassportDetails(ctx context.Context, id uuid.UUID, passportDetails *PassportDetails) error
	DeletePassportDetails(ctx context.Context, id uuid.UUID) error
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of User RepositoryDB with the provided database connection pool.
func NewRepositoryDB(db *pgxpool.Pool) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) GetById(
	ctx context.Context,
	id uuid.UUID,
) (_ *User, found bool, err error) {
	query := `
	SELECT 
		id,
		display_name,
		phone_number,
		avatar_key,
		avatar_url,
		first_name,
		last_name,
		date_of_birth,
		gender,
		nationality,
		country_code,
		address_line1,
		city,
		zip_code,
		passport_first_name,
		passport_last_name,
		passport_number,
		passport_issue_country,
		passport_expire_date,
		genius_tier
	FROM users
	WHERE id = $1
	`
	var user User

	if err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.DisplayName,
		&user.PhoneNumber,
		&user.AvatarKey,
		&user.AvatarURL,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Gender,
		&user.Nationality,
		&user.CountryCode,
		&user.AddressLine1,
		&user.City,
		&user.ZipCode,
		&user.PassportFirstName,
		&user.PassportLastName,
		&user.PassportNumber,
		&user.PassportIssueCountry,
		&user.PassportExpireDate,
		&user.GeniusTier,
	); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, false, nil
		}

		return nil, false, err
	}

	return &user, true, nil
}

func (r *repositoryDB) UpdateAvatar(
	ctx context.Context,
	id uuid.UUID, avatarKey, avatarUrl string,
) error {
	query := `
	UPDATE users
	SET
		avatar_key = $1,
		avatar_url = $2,
		updated_at = $3
	WHERE id = $4
	`

	_, err := r.db.Exec(ctx, query,
		avatarKey,
		avatarUrl,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateName(
	ctx context.Context,
	id uuid.UUID,
	firstName, lastName string,
) error {
	query := `
	UPDATE users
	SET
		first_name = $1,
		last_name = $2,
		updated_at = $3
	WHERE id = $4
	`

	_, err := r.db.Exec(ctx, query,
		firstName,
		lastName,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateDisplayName(
	ctx context.Context,
	id uuid.UUID,
	displayName string,
) error {
	query := `
	UPDATE users
	SET
		display_name = $1,
		updated_at = $2
	WHERE id = $3
	`

	_, err := r.db.Exec(ctx, query,
		displayName,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdatePhoneNumber(
	ctx context.Context,
	id uuid.UUID,
	phoneNumber string,
) error {
	query := `
	UPDATE users
	SET
		phone_number = $1,
		updated_at = $2
	WHERE id = $3
	`

	_, err := r.db.Exec(ctx, query,
		phoneNumber,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateDateOfBirth(
	ctx context.Context,
	id uuid.UUID,
	dateOfBirth time.Time,
) error {
	query := `
	UPDATE users
	SET
		date_of_birth = $1,
		updated_at = $2
	WHERE id = $3
	`

	_, err := r.db.Exec(ctx, query,
		dateOfBirth,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateNationality(
	ctx context.Context,
	id uuid.UUID,
	nationality string,
) error {
	query := `
	UPDATE users
	SET
		nationality = $1,
		updated_at = $2
	WHERE id = $3
	`

	_, err := r.db.Exec(ctx, query,
		nationality,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateGender(ctx context.Context, id uuid.UUID, gender string) error {
	query := `
	UPDATE users
	SET
		gender = $1,
		updated_at = $2
	WHERE id = $3
	`

	_, err := r.db.Exec(ctx, query,
		gender,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdateAddress(
	ctx context.Context,
	id uuid.UUID,
	addr *Address,
) error {
	query := `
	UPDATE users
	SET
		country_code = $1,
		address_line1 = $2,
		city = $3,
		zip_code = $4,
		updated_at = $5
	WHERE id = $6
	`

	_, err := r.db.Exec(ctx, query,
		addr.CountryCode,
		addr.AddressLine1,
		addr.City,
		addr.ZipCode,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdatePassportDetails(
	ctx context.Context,
	id uuid.UUID,
	passportDetails *PassportDetails,
) error {
	query := `
	UPDATE users
	SET
		passport_first_name = $1,
		passport_last_name = $2,
		passport_number = $3,
		passport_issue_country = $4,
		passport_expire_date = $5,
		updated_at = $6
	WHERE id = $7
	`

	_, err := r.db.Exec(ctx, query,
		passportDetails.FirstName,
		passportDetails.LastName,
		passportDetails.PassportNumber,
		passportDetails.IssueCountry,
		passportDetails.ExpireDate,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) DeletePassportDetails(ctx context.Context, id uuid.UUID) error {
	query := `
	UPDATE users
	SET
		passport_first_name = NULL,
		passport_last_name = NULL,
		passport_number = NULL,
		passport_issue_country = NULL,
		passport_expire_date = NULL,
		updated_at = $1
	WHERE id = $2
	`

	_, err := r.db.Exec(ctx, query,
		time.Now().UTC(),
		id)
	if err != nil {
		return err
	}

	return nil
}
