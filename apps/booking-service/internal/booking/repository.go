// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/shopspring/decimal"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
	"github.com/suphawit-wt/travelbook/pkg/propertyclient"
)

// Info represents the details of a booking, including check-in/check-out dates, guest information, room details, and pricing.
type Info struct {
	CheckIn        string
	CheckOut       string
	Nights         uint8
	Guests         Guest
	Rooms          []RoomBooking
	TotalRooms     uint8
	TotalPrice     float64
	TaxesAndFees   float64
	FreeCancelDate string
	PropertyID     uuid.UUID
}

// RoomBooking represents the details of a room booked, including the room name and quantity.
type RoomBooking struct {
	RoomID   uuid.UUID
	Name     string
	Quantity uint8
}

// CreateBooking represents the details of a Booking creation details.
type CreateBooking struct {
	PropertyID   uuid.UUID
	CheckIn      time.Time
	CheckOut     time.Time
	Rooms        []Room
	Guests       Guest
	Nights       uint8
	CurrencyCode string
}

// Room represents the details of a room associated with a booking.
type Room struct {
	RoomTypeID uuid.UUID
	RatePlanID uuid.UUID
	Quantity   uint8
}

// Guest represents the number of adults and children in a booking.
type Guest struct {
	Adults   uint8
	Children uint8
}

// ToReserveRequest maps a CreateBooking domain entity to a ReserveRequest client DTO.
func (d *CreateBooking) ToReserveRequest() *propertyclient.ReserveRequest {
	rooms := make([]propertyclient.Room, len(d.Rooms))
	for i, room := range d.Rooms {
		rooms[i] = propertyclient.Room{
			RoomTypeID: room.RoomTypeID,
			RatePlanID: room.RatePlanID,
			Quantity:   room.Quantity,
		}
	}

	return &propertyclient.ReserveRequest{
		PropertyID:   d.PropertyID,
		CheckIn:      d.CheckIn,
		CheckOut:     d.CheckOut,
		Rooms:        rooms,
		Guests:       propertyclient.Guest(d.Guests),
		Nights:       d.Nights,
		CurrencyCode: d.CurrencyCode,
	}
}

// InventoryHold represents held inventory details during booking reservation.
type InventoryHold struct {
	ReservationID uuid.UUID
	PropertyID    uuid.UUID
	ExpiresAt     time.Time
	TotalUSD      decimal.Decimal
	TotalLocal    decimal.Decimal
	ExchangeRate  decimal.Decimal
	ReservedRooms []ReservedRoomItem
}

// ReservedRoomItem represents an individual reserved room item within an inventory hold.
type ReservedRoomItem struct {
	RoomTypeID       uuid.UUID
	RoomName         string
	RatePlanID       uuid.UUID
	Quantity         int
	PricePerNightUSD decimal.Decimal
}

// FromDTO converts a ReserveResponse client DTO into an InventoryHold domain entity.
func (d *InventoryHold) FromDTO(dto *propertyclient.ReserveResponse) *InventoryHold {
	reservedRooms := make([]ReservedRoomItem, len(dto.ReservedRooms))
	for i, room := range dto.ReservedRooms {
		reservedRooms[i] = ReservedRoomItem{
			RoomTypeID:       room.RoomTypeID,
			RoomName:         room.RoomName,
			RatePlanID:       room.RatePlanID,
			Quantity:         room.Quantity,
			PricePerNightUSD: room.PricePerNightUSD,
		}
	}

	return &InventoryHold{
		ReservationID: dto.ReservationID,
		PropertyID:    dto.PropertyID,
		ExpiresAt:     dto.ExpiresAt,
		TotalUSD:      dto.TotalUSD,
		TotalLocal:    dto.TotalLocal,
		ExchangeRate:  dto.ExchangeRate,
		ReservedRooms: reservedRooms,
	}
}

// UpdateBooking represents the details of a Booking details update.
type UpdateBooking struct {
	BookingID       uuid.UUID
	FirstName       string
	LastName        string
	Email           string
	CountryCode     string
	Phone           string
	GuestName       string
	SpecialRequests string
}

// Repository defines the data access contract for booking entities.
type Repository interface {
	GetByID(
		ctx context.Context,
		id uuid.UUID,
		currencyCode string,
	) (booking *Info, found bool, err error)
	GetTotalPriceCents(ctx context.Context, bookingID uuid.UUID) (int64, error)
	Create(
		ctx context.Context,
		tx pgx.Tx,
		bookingID uuid.UUID,
		req *CreateBooking,
		hold *InventoryHold,
	) error
	UpdateDetails(
		ctx context.Context,
		req *UpdateBooking,
	) error
}

type repositoryDB struct {
	logger      *zaplog.Logger
	db          *pgxpool.Pool
	redisClient *redis.Client
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(
	logger *zaplog.Logger,
	db *pgxpool.Pool,
	redisClient *redis.Client,
) Repository {
	return &repositoryDB{logger: logger, db: db, redisClient: redisClient}
}

func (r *repositoryDB) GetByID(
	ctx context.Context,
	id uuid.UUID,
	currencyCode string,
) (*Info, bool, error) {
	query := `
	SELECT
		check_in,
		check_out,
		adults,
		children,
		total_price_usd,
		property_id
	FROM bookings
	WHERE id = $1
	AND status = 'pending'
	`

	var info Info

	var checkIn time.Time
	var checkOut time.Time

	if err := r.db.QueryRow(ctx, query, id).Scan(
		&checkIn,
		&checkOut,
		&info.Guests.Adults,
		&info.Guests.Children,
		&info.TotalPrice,
		&info.PropertyID,
	); err != nil {
		return nil, false, err
	}

	info.CheckIn = checkIn.Format(time.DateOnly)
	info.CheckOut = checkOut.Format(time.DateOnly)

	info.Nights = uint8(checkOut.Sub(checkIn).Hours() / 24)

	roomQuery := `
	SELECT
		room_type_id,
		room_name,
		quantity
	FROM booking_rooms
	WHERE booking_id = $1
	`

	rows, err := r.db.Query(ctx, roomQuery, id)
	if err != nil {
		return nil, false, err
	}
	defer rows.Close()

	var totalRooms uint8

	for rows.Next() {
		var room RoomBooking

		if err := rows.Scan(&room.RoomID, &room.Name, &room.Quantity); err != nil {
			return nil, false, err
		}

		totalRooms += room.Quantity
		info.Rooms = append(info.Rooms, room)
	}

	info.TotalRooms = totalRooms

	freeCancel := checkIn.AddDate(0, 0, -1)
	info.FreeCancelDate = freeCancel.Format("2006-01-02")

	return &info, true, nil
}

func (r *repositoryDB) GetTotalPriceCents(
	ctx context.Context,
	bookingID uuid.UUID,
) (int64, error) {
	query := "SELECT total_price_usd FROM bookings WHERE id = $1"

	var totalPriceUsd float64

	if err := r.db.QueryRow(ctx, query, bookingID).Scan(&totalPriceUsd); err != nil {
		return 0, err
	}

	totalPriceCents := int64(math.Round(totalPriceUsd * 100))

	return totalPriceCents, nil
}

func (r *repositoryDB) Create(
	ctx context.Context,
	tx pgx.Tx,
	bookingID uuid.UUID,
	req *CreateBooking,
	hold *InventoryHold,
) error {
	_, err := tx.Exec(
		ctx,
		`
		INSERT INTO bookings (id, property_id, status, adults, children, total_price_usd, 
		currency_code, exchange_rate, total_price_local, check_in, check_out, expires_at)
		VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
		bookingID,
		req.PropertyID,
		req.Guests.Adults,
		req.Guests.Children,
		hold.TotalUSD,
		req.CurrencyCode,
		hold.ExchangeRate,
		hold.TotalLocal,
		req.CheckIn,
		req.CheckOut,
		hold.ExpiresAt,
	)
	if err != nil {
		return err
	}

	insertBookingRoomsQuery := `
			INSERT INTO booking_rooms (id, booking_id, room_type_id, room_name, rate_plan_id, quantity, nights, price_per_night_usd)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`

	for _, room := range hold.ReservedRooms {
		bookingRoomsID, err := uuid.NewV7()
		if err != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", err)
		}

		_, err = tx.Exec(
			ctx,
			insertBookingRoomsQuery,
			bookingRoomsID,
			bookingID,
			room.RoomTypeID,
			room.RoomName,
			room.RatePlanID,
			room.Quantity,
			req.Nights,
			room.PricePerNightUSD,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *repositoryDB) UpdateDetails(ctx context.Context, req *UpdateBooking) error {
	query := `
	UPDATE bookings
	SET
		contact_first_name = $1,
		contact_last_name = $2,
		contact_email = $3,
		contact_country_code = $4,
		contact_phone = $5,
		guest_name = $6,
		special_requests = $7,
		updated_at = $8
	WHERE id = $9
	AND status = 'pending'
	`

	_, err := r.db.Exec(
		ctx,
		query,
		req.FirstName,
		req.LastName,
		req.Email,
		req.CountryCode,
		req.Phone,
		req.GuestName,
		req.SpecialRequests,
		time.Now().UTC(),
		req.BookingID,
	)
	if err != nil {
		return err
	}

	return nil
}
