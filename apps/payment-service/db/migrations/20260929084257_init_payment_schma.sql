-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    booking_id UUID NOT NULL,     
    user_id UUID,               
    provider TEXT NOT NULL,     
    provider_payment_id TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed','refunded','cancelled')),
    payment_method TEXT,
    raw_response JSONB,        
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(provider, provider_payment_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS payments;
-- +goose StatementEnd
