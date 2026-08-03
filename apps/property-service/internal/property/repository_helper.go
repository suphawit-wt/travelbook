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

func (r *repositoryDB) getCurrencyRate(ctx context.Context, currencyCode string) (float64, error) {
	var rate float64
	var precision uint8
	query := `SELECT rate_to_usd, precision FROM currencies WHERE code = $1`

	if err := r.db.QueryRow(ctx, query, currencyCode).Scan(&rate, &precision); err != nil {
		return 0, fmt.Errorf("failed to find currency rate: %w", err)
	}
	return rate, nil
}

func (r *repositoryDB) queryAvailableProperties(
	ctx context.Context,
	propertyIDs []string,
	checkIn, checkOut time.Time,
	nights, adults, children, room uint8,
	currencyRate float64,
) (properties []SearchProperty, roomTypeIDs []string, roomToPropertyIdx map[string]int, err error) {
	query := `
        SELECT 
            p.id, p.slug, p.name, co.code AS country_code, ci.key AS city, a.key AS area,
            p.avg_rating, p.review_count, cheapest.total_price AS starting_price,
            cheapest.room_type_id, cheapest.room_name, cheapest.breakfast_included, pi.image_url
        FROM properties p
        LEFT JOIN areas a ON p.area_id = a.id
        LEFT JOIN cities ci ON a.city_id = ci.id
        LEFT JOIN provinces pr ON ci.province_id = pr.id
        LEFT JOIN countries co ON pr.country_id = co.id
        JOIN LATERAL (
            SELECT 
                rt.id AS room_type_id, rt.name AS room_name, rp.breakfast_included,
                SUM(ri.price_usd) AS total_price
            FROM room_types rt
            JOIN rate_plans rp ON rp.room_type_id = rt.id
            JOIN room_inventory ri ON ri.room_type_id = rt.id
            WHERE 
                rt.property_id = p.id
                AND ri.date >= $2 AND ri.date < $3      
                AND ri.available_rooms >= $7 
                AND rt.max_adults >= $5 AND rt.max_children >= $6  
            GROUP BY rt.id, rp.id
            HAVING COUNT(DISTINCT ri.date) = $4
            ORDER BY total_price ASC
            LIMIT 1
        ) cheapest ON true
        JOIN property_availability pa ON pa.property_id = p.id
        LEFT JOIN property_images pi ON pi.property_id = p.id AND pi.position = 1
        WHERE p.status = 'active'
        AND p.id = ANY($1) 
        AND pa.date >= $2 AND pa.date < $3
        AND pa.available_rooms >= $7
        GROUP BY 
            p.id, co.code, ci.key, a.key, p.avg_rating, p.review_count,
            cheapest.total_price, cheapest.room_type_id, cheapest.room_name,
            cheapest.breakfast_included, pi.image_url
        HAVING COUNT(DISTINCT pa.date) = $4 
        ORDER BY array_position($1, p.id);
    `

	rows, err := r.db.Query(
		ctx,
		query,
		propertyIDs,
		checkIn,
		checkOut,
		nights,
		adults,
		children,
		room,
	)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("failed to query available properties: %w", err)
	}

	var availableProperties []SearchProperty
	roomToPropertyIdx = make(map[string]int)

	for rows.Next() {
		var p SearchProperty
		var roomTypeID string

		err := rows.Scan(
			&p.Id, &p.Slug, &p.Name, &p.CountryCode, &p.City, &p.Area,
			&p.AvgRating, &p.ReviewCount, &p.StartingPrice, &roomTypeID,
			&p.Room.Name, &p.Room.BreakfastIncluded, &p.Image,
		)
		if err != nil {
			rows.Close()
			return nil, nil, nil, fmt.Errorf("failed to scan property row: %w", err)
		}

		p.StartingPrice *= currencyRate
		p.Room.Beds = []BedsResponse{}

		availableProperties = append(availableProperties, p)
		roomToPropertyIdx[roomTypeID] = len(availableProperties) - 1
		roomTypeIDs = append(roomTypeIDs, roomTypeID)
	}

	if err := rows.Err(); err != nil {
		rows.Close()
		return nil, nil, nil, fmt.Errorf("error iterating property rows: %w", err)
	}
	rows.Close()

	return availableProperties, roomTypeIDs, roomToPropertyIdx, nil
}

func (r *repositoryDB) fetchRoomBeds(
	ctx context.Context,
	roomTypeIDs []string,
	roomToPropertyIdx map[string]int,
	properties []SearchProperty,
) error {
	if len(roomTypeIDs) == 0 {
		return nil
	}

	bedsQuery := `
        SELECT room_type_id, bed_type, quantity 
        FROM room_beds 
        WHERE room_type_id = ANY($1)
    `
	bedRows, err := r.db.Query(ctx, bedsQuery, roomTypeIDs)
	if err != nil {
		return fmt.Errorf("failed to query room beds: %w", err)
	}
	defer bedRows.Close()

	for bedRows.Next() {
		var roomTypeId string
		var bed BedsResponse

		if err := bedRows.Scan(&roomTypeId, &bed.Type, &bed.Quantity); err != nil {
			return fmt.Errorf("failed to scan bed row: %w", err)
		}

		if idx, found := roomToPropertyIdx[roomTypeId]; found {
			properties[idx].Room.Beds = append(properties[idx].Room.Beds, bed)
		}
	}

	return nil
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
