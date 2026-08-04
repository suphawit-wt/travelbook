-- Keyspace Definition
CREATE KEYSPACE IF NOT EXISTS review_db
WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'dc1': 3
} AND durable_writes = true;

-- Select all reviews by property_id (Newest first)
CREATE TABLE IF NOT EXISTS review_db.reviews_by_property (
    property_id uuid,
    created_at timestamp,
    review_id uuid,           -
    booking_id uuid,
    user_id uuid,
    user_display_name text,
    user_country_code ascii,
    rating smallint,     
    staff smallint,
    cleanliness smallint,
    facilities smallint,
    comfort smallint,
    value_score smallint,   
    location smallint,
    wifi smallint,
    comment text,
    updated_at timestamp,
    PRIMARY KEY ((property_id), created_at, review_id)
) WITH CLUSTERING ORDER BY (created_at DESC, review_id ASC);

-- Select all reviews by user_id (Newest first)
CREATE TABLE IF NOT EXISTS review_db.reviews_by_user (
    user_id uuid,
    user_display_name text,
    user_country_code ascii,
    created_at timestamp,
    review_id uuid,
    property_id uuid,
    booking_id uuid,
    rating smallint,
    staff smallint,
    cleanliness smallint,
    facilities smallint,
    comfort smallint,
    value_score smallint,
    location smallint,
    wifi smallint,
    comment text,
    updated_at timestamp,
    PRIMARY KEY ((user_id), created_at, review_id)
) WITH CLUSTERING ORDER BY (created_at DESC, review_id ASC);