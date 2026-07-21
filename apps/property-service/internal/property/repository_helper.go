// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type locationNames struct {
	AreaNameEN        string
	AreaNameLocal     string
	CityNameEN        string
	CityNameLocal     string
	ProvinceNameEN    string
	ProvinceNameLocal string
}

func (r *repositoryDB) getLocationNamesByAreaID(
	ctx context.Context,
	tx pgx.Tx,
	areaID uuid.UUID,
) (*locationNames, error) {
	query := `
		SELECT 
			a.name_en AS area_name_en, a.name_local AS area_name_local,
			c.name_en AS city_name_en, c.name_local AS city_name_local,
			p.name_en AS province_name_en, p.name_local AS province_name_local
		FROM areas a
		JOIN cities c ON a.city_id = c.id
		JOIN provinces p ON c.province_id = p.id
		WHERE a.id = $1
		FOR SHARE;
	`

	var names locationNames
	err := tx.QueryRow(ctx, query, areaID).Scan(
		&names.AreaNameEN, &names.AreaNameLocal,
		&names.CityNameEN, &names.CityNameLocal,
		&names.ProvinceNameEN, &names.ProvinceNameLocal,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch location hierarchy names: %w", err)
	}

	return &names, nil
}

func (r *repositoryDB) insertRoomType(
	ctx context.Context,
	tx pgx.Tx,
	id, propID uuid.UUID,
	req *CreatePropertyRoom,
) error {
	_, err := tx.Exec(ctx, `
        INSERT INTO room_types (
            id, property_id, name, max_adults, max_children, base_price_usd, total_rooms
        )
        VALUES ($1, $2, $3, $4, $5, $6::numeric / 100, $7)
    `, id, propID, req.Name, req.MaxAdults, req.MaxChildren, req.BasePriceCents, req.TotalRooms)
	return err
}

func (r *repositoryDB) insertRoomBeds(
	ctx context.Context,
	tx pgx.Tx,
	roomID uuid.UUID,
	beds []CreateBed,
) error {
	batch := &pgx.Batch{}
	for _, b := range beds {
		roomBedID, err := uuid.NewV7()
		if err != nil {
			return fmt.Errorf("failed to generate id uuid v7: %w", err)
		}

		batch.Queue(`
            INSERT INTO room_beds (id, room_type_id, bed_type, quantity)
            VALUES ($1, $2, $3, $4)
        `, roomBedID, roomID, b.BedType, b.Quantity)
	}

	br := tx.SendBatch(ctx, batch)
	defer func() { _ = br.Close() }()

	for i := 0; i < len(beds); i++ {
		if _, err := br.Exec(); err != nil {
			return err
		}
	}

	return br.Close()
}

func (r *repositoryDB) syncInventory(
	ctx context.Context,
	tx pgx.Tx,
	roomID, propertyID uuid.UUID,
	req *CreatePropertyRoom,
) error {
	startDate := time.Now().Truncate(24 * time.Hour)
	endDate := startDate.AddDate(0, 0, 365)

	_, err := tx.Exec(ctx, `
        INSERT INTO room_inventory (room_type_id, date, available_rooms, price_usd)
        SELECT $1, d::date, $2, $3::numeric / 100
        FROM generate_series($4::date, $5::date, interval '1 day') d
        ON CONFLICT (room_type_id, date) DO NOTHING
    `, roomID, req.TotalRooms, req.BasePriceCents, startDate, endDate)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, `
        INSERT INTO property_availability (property_id, date, available_rooms, min_price_usd)
        SELECT rt.property_id, ri.date, SUM(ri.available_rooms), MIN(ri.price_usd)
        FROM room_inventory ri
        JOIN room_types rt ON rt.id = ri.room_type_id
        WHERE rt.property_id = $1 AND ri.date BETWEEN $2 AND $3
        GROUP BY rt.property_id, ri.date
        ON CONFLICT (property_id, date)
        DO UPDATE SET
            available_rooms = EXCLUDED.available_rooms,
            min_price_usd = EXCLUDED.min_price_usd
    `, propertyID, startDate, endDate)
	return err
}
