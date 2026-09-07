-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_id UUID,              
    property_id UUID NOT NULL,    
    check_in DATE NOT NULL,
    check_out DATE NOT NULL CHECK (check_out > check_in),
    adults INT NOT NULL CHECK (adults > 0),
    children INT NOT NULL DEFAULT 0 CHECK (children >= 0),
    status TEXT NOT NULL CHECK (status IN ('pending','confirmed','cancelled','completed')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid','paid','partially_paid','refunded')),
    total_price_usd NUMERIC(12,2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    exchange_rate NUMERIC(18,8) NOT NULL,
    total_price_local NUMERIC(12,2) NOT NULL,
    contact_first_name TEXT,
    contact_last_name TEXT,
    contact_email TEXT,
    contact_country_code CHAR(2),
    contact_phone TEXT,
    guest_name TEXT,
    special_requests TEXT,
    confirmation_code TEXT,
    access_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_dates ON bookings(property_id, check_in, check_out);

CREATE TABLE IF NOT EXISTS booking_rooms (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL,
    room_name TEXT NOT NULL,     
    rate_plan_id UUID NOT NULL,     
    quantity INT NOT NULL CHECK (quantity > 0),
    nights INT NOT NULL CHECK (nights > 0),
    price_per_night_usd NUMERIC(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_rooms_booking_id ON booking_rooms(booking_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS booking_rooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
-- +goose StatementEnd
