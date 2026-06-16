-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    email CITEXT NOT NULL UNIQUE,
    username CITEXT UNIQUE CHECK (username NOT LIKE '%@%'),
    password_hash VARCHAR(255),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS account_oauth_providers (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,    
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_account_oauth_providers_account_id ON account_oauth_providers(account_id);

CREATE TABLE IF NOT EXISTS account_roles (
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (account_id, role)
);

CREATE TABLE IF NOT EXISTS public.outbox (
    id UUID DEFAULT uuidv7(),
    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type TEXT NOT NULL, 
    topic TEXT NOT NULL,  
    payload JSONB NOT NULL,
    tracing_context JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT partman.create_parent(
    p_parent_table := 'public.outbox',
    p_control := 'created_at',
    p_interval := '1 day',
    p_premake := 3
);

UPDATE partman.part_config
SET retention = '7 days',
    retention_keep_table = false,
    retention_keep_index = false
WHERE parent_table = 'public.outbox';

INSERT INTO public.accounts (id, email, username, password_hash, auth_type, email_verified)
VALUES (
    '3b512901-2158-4b5f-bad4-1d348173716c',
    'partner01@gmail.com',
    'partner01',
    '$argon2id$v=19$m=65536,t=1,p=4$oPgcIE71ZvCG7PIppN1V9g$vUMIixA8X2J4Gf7ZjEaYqI8mYeTdr7c463tuJvVzP/s',
    'PASSWORD',
    TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.account_roles (account_id, role)
VALUES ('3b512901-2158-4b5f-bad4-1d348173716c', 'owner')
ON CONFLICT (account_id, role) DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS account_roles;
DROP TABLE IF EXISTS account_oauth_providers;
DROP TABLE IF EXISTS accounts;
DELETE FROM partman.part_config WHERE parent_table = 'public.outbox';
DROP TABLE IF EXISTS public.outbox;
-- +goose StatementEnd
