// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package booking

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository defines the data access contract for booking entities.
type Repository interface {
	RestoreRoomInventory(
		ctx context.Context,
		tx pgx.Tx,
		bookingID uuid.UUID,
	) (*Restore, error)
}

type repositoryDB struct {
	db *pgxpool.Pool
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(
	db *pgxpool.Pool,
) Repository {
	return &repositoryDB{db: db}
}

func (r *repositoryDB) RestoreRoomInventory(
	ctx context.Context,
	tx pgx.Tx,
	bookingID uuid.UUID,
) (*Restore, error) {
	propertyIDStr, checkIn, checkOut, shouldProceed, err := r.getBookingLock(ctx, tx, bookingID)
	if err != nil || !shouldProceed {
		return nil, err
	}

	roomsToRestore, err := r.getRoomsToRestore(ctx, tx, bookingID)
	if err != nil {
		return nil, err
	}

	_, err = tx.Exec(ctx, `
        UPDATE bookings 
        SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW() 
        WHERE id = $1`, bookingID)
	if err != nil {
		return nil, err
	}

	propertyID, err := uuid.Parse(propertyIDStr)
	if err != nil {
		return nil, fmt.Errorf("faild to parse property id")
	}

	return &Restore{
		PropertyID: propertyID,
		CheckIn:    checkIn,
		CheckOut:   checkOut,
		Rooms:      roomsToRestore,
	}, nil
}

func (r *repositoryDB) getBookingLock(
	ctx context.Context, tx pgx.Tx, bookingID uuid.UUID,
) (propertyID string, checkIn, checkOut time.Time, shouldProceed bool, err error) {
	var status, paymentStatus string
	err = tx.QueryRow(ctx, `
        SELECT status, payment_status, property_id, check_in, check_out 
        FROM bookings WHERE id = $1 FOR UPDATE`, bookingID).
		Scan(&status, &paymentStatus, &propertyID, &checkIn, &checkOut)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", time.Time{}, time.Time{}, false, nil
		}
		return "", time.Time{}, time.Time{}, false, fmt.Errorf(
			"failed to lock booking row: %w",
			err,
		)
	}

	if status != "pending" || paymentStatus != "unpaid" {
		return "", time.Time{}, time.Time{}, false, nil
	}

	return propertyID, checkIn, checkOut, true, nil
}

func (r *repositoryDB) getRoomsToRestore(
	ctx context.Context, tx pgx.Tx, bookingID uuid.UUID,
) ([]RoomItem, error) {
	rows, err := tx.Query(
		ctx,
		`SELECT room_type_id, quantity FROM booking_rooms WHERE booking_id = $1`,
		bookingID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query booking rooms: %w", err)
	}
	defer rows.Close()

	var roomsToRestore []RoomItem
	for rows.Next() {
		var item RoomItem
		if err = rows.Scan(&item.RoomTypeID, &item.Quantity); err != nil {
			return nil, fmt.Errorf("failed to scan booking room row: %w", err)
		}
		roomsToRestore = append(roomsToRestore, item)
	}

	return roomsToRestore, nil
}
