-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
        CREATE TYPE property_type AS ENUM ('hotel','apartment','villa','cabin','resort');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM ('draft','active','inactive','deleted');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    code VARCHAR(2) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_local VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provinces (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    country_id UUID NOT NULL REFERENCES countries(id),
    key VARCHAR(50) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_local VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_provinces_country ON provinces(country_id);

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    key VARCHAR(50) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_local VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cities_province ON cities(province_id);

CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    key VARCHAR(50) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_local VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_areas_city ON areas(city_id);

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type property_type NOT NULL,
    status property_status NOT NULL DEFAULT 'draft',
    timezone TEXT NOT NULL,
    check_in_from TIME NOT NULL DEFAULT '14:00',
    check_in_until TIME NOT NULL DEFAULT '22:00',
    check_out_from TIME NOT NULL DEFAULT '00:00',
    check_out_until TIME NOT NULL DEFAULT '12:00',
    area_id UUID REFERENCES areas(id),
    address_line1 TEXT,
    address_line2 TEXT,
    zip_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    review_count INT NOT NULL DEFAULT 0,
    staff_avg NUMERIC(3,2),
    cleanliness_avg NUMERIC(3,2),
    facilities_avg NUMERIC(3,2),
    comfort_avg NUMERIC(3,2),
    value_avg NUMERIC(3,2),
    location_avg NUMERIC(3,2),
    wifi_avg NUMERIC(3,2),
    about TEXT,
    highlights JSONB,
    area_info JSONB,
    rules JSONB,
    fine_print TEXT,
    partner_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_properties_partner_id ON properties(partner_id);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_search_sort ON properties(status, area_id, type, avg_rating DESC);

CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    key TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    position INT NOT NULL CHECK (position >= 0),
    orientation TEXT NOT NULL CHECK (orientation IN ('landscape','portrait')),
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

CREATE TABLE IF NOT EXISTS facility_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES facility_categories(id),
    name TEXT NOT NULL,
    UNIQUE(category_id, name)
);

CREATE TABLE IF NOT EXISTS property_facilities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    facility_id INT NOT NULL REFERENCES facilities(id),
    PRIMARY KEY(property_id, facility_id)
);

CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    max_adults INT NOT NULL CHECK (max_adults > 0),
    max_children INT NOT NULL CHECK (max_children >= 0),
    base_price_usd NUMERIC(12,2) NOT NULL,
    total_rooms INT NOT NULL CHECK (total_rooms > 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);

CREATE TABLE IF NOT EXISTS room_beds (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    bed_type TEXT,
    quantity INT CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS rate_plans (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    room_type_id UUID NOT NULL REFERENCES room_types(id),
    name TEXT NOT NULL,
    refundable BOOLEAN DEFAULT TRUE,
    breakfast_included BOOLEAN DEFAULT FALSE,
    price_modifier_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(room_type_id, name)
);
CREATE INDEX IF NOT EXISTS idx_rate_plans_room_type_id ON rate_plans(room_type_id);

CREATE TABLE IF NOT EXISTS currencies (
    code CHAR(3) PRIMARY KEY CHECK (code ~ '^[A-Z]{3}$'),
    rate_to_usd NUMERIC(18,8) NOT NULL CHECK (rate_to_usd > 0),
    precision INT NOT NULL DEFAULT 2 CHECK (precision BETWEEN 0 AND 6),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS room_inventory (
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INT NOT NULL CHECK (available_rooms >= 0),
    price_usd NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(room_type_id, date)
);
CREATE INDEX IF NOT EXISTS idx_room_inventory_search ON room_inventory(room_type_id, date);

CREATE TABLE IF NOT EXISTS property_availability (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INT NOT NULL CHECK (available_rooms >= 0),
    min_price_usd NUMERIC(12,2) NOT NULL,
    PRIMARY KEY(property_id, date)
);
CREATE INDEX IF NOT EXISTS idx_property_availability_property_date ON property_availability(property_id, date);

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
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM partman.part_config WHERE parent_table = 'public.outbox';
DROP TABLE IF EXISTS public.outbox CASCADE;

DROP TABLE IF EXISTS property_availability CASCADE;
DROP TABLE IF EXISTS room_inventory CASCADE;
DROP TABLE IF EXISTS rate_plans CASCADE;
DROP TABLE IF EXISTS room_beds CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS property_facilities CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS facility_categories CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

DROP TABLE IF EXISTS areas CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

DROP TABLE IF EXISTS currencies CASCADE;

DROP TYPE IF EXISTS property_status;
DROP TYPE IF EXISTS property_type;
-- +goose StatementEnd
