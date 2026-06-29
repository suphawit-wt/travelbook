-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,

    display_name TEXT,
    phone_number TEXT UNIQUE CHECK (phone_number ~ '^[0-9+]+$'),

    avatar_key TEXT,
    avatar_url TEXT,

    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT,
    nationality CHAR(2),

    country_code CHAR(2),
    address_line1 TEXT,
    city TEXT,
    zip_code TEXT,

    passport_first_name TEXT,
    passport_last_name TEXT,
    passport_number TEXT,
    passport_issue_country CHAR(2),
    passport_expire_date DATE,

    genius_tier SMALLINT NOT NULL DEFAULT 1
        CHECK (genius_tier BETWEEN 1 AND 10),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
-- +goose StatementEnd

-- +goose Down
DROP TABLE IF EXISTS users;
