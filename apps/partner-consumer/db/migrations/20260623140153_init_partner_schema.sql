-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_role') THEN
        CREATE TYPE partner_role AS ENUM ('owner','manager','viewer');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE CHECK (phone_number ~ '^[0-9+]+$'),
    status TEXT NOT NULL DEFAULT 'unverify' CHECK (status IN ('unverify','verified')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS partner_properties (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    property_id UUID NOT NULL, 
    role partner_role NOT NULL DEFAULT 'manager',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(partner_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_properties_partner_id ON partner_properties(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_properties_property_id ON partner_properties(property_id);

-- Seed Data
INSERT INTO public.partners (id, first_name, last_name, phone_number, status, created_at, updated_at, deleted_at) 
VALUES 
('3b512901-2158-4b5f-bad4-1d348173716c', 'John', 'Smith', '+66912345678', 'verified', '2026-05-25 17:46:32.000533+00', '2026-05-25 17:47:42.653302+00', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.partner_properties (id, partner_id, property_id, role, created_at, updated_at) 
VALUES 
('e4703ce6-abf2-4f94-b293-3436077c041a', '3b512901-2158-4b5f-bad4-1d348173716c', '49a9eccd-0746-4647-bce2-13a20b482f1d', 'owner', '2026-05-25 17:48:15.632896+00', '2026-05-25 17:48:15.632896+00'),
('140cee45-c490-41eb-a9cf-02635216a5dc', '3b512901-2158-4b5f-bad4-1d348173716c', '38d4d122-f84b-4668-b6ac-5ce52313eda9', 'owner', '2026-05-26 14:45:14.721662+00', '2026-05-26 14:45:14.721662+00'),
('3d189bff-545a-42df-aa16-9ad55c41ecb9', '3b512901-2158-4b5f-bad4-1d348173716c', '9d176656-8eda-4f66-87ef-57b2089e95ad', 'owner', '2026-05-26 17:59:47.783434+00', '2026-05-26 17:59:47.783434+00'),
('c65a0ae5-2650-40b9-8f78-79afa2e23e35', '3b512901-2158-4b5f-bad4-1d348173716c', 'f9fdde87-8389-4a95-b01c-9a7d94d4126d', 'owner', '2026-05-28 07:37:40.923035+00', '2026-05-28 07:37:40.923035+00'),
('f1759106-3453-4e7a-8bae-a5c7176394b8', '3b512901-2158-4b5f-bad4-1d348173716c', 'f0102826-790b-4c26-9dda-eb5316f41364', 'owner', '2026-05-28 15:57:59.209838+00', '2026-05-28 15:57:59.209838+00')
ON CONFLICT (id) DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS partner_properties CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TYPE IF EXISTS partner_role;
-- +goose StatementEnd
