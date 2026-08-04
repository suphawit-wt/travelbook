-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    property_id UUID NOT NULL,      
    booking_id UUID NOT NULL,    
    user_id UUID NOT NULL,          
    user_display_name TEXT, 
    user_country_code VARCHAR(2),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
    staff SMALLINT CHECK (staff BETWEEN 1 AND 10),
    cleanliness SMALLINT CHECK (cleanliness BETWEEN 1 AND 10),
    facilities SMALLINT CHECK (facilities BETWEEN 1 AND 10),
    comfort SMALLINT CHECK (comfort BETWEEN 1 AND 10),
    value SMALLINT CHECK (value BETWEEN 1 AND 10),
    location SMALLINT CHECK (location BETWEEN 1 AND 10),
    wifi SMALLINT CHECK (wifi BETWEEN 1 AND 10),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, booking_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

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
DROP TABLE IF EXISTS reviews;
DELETE FROM partman.part_config WHERE parent_table = 'public.outbox';
DROP TABLE IF EXISTS public.outbox;
-- +goose StatementEnd
