// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/shopspring/decimal"
)

type locationNames struct {
	AreaNameEN        string
	AreaNameLocal     string
	CityNameEN        string
	CityNameLocal     string
	ProvinceNameEN    string
	ProvinceNameLocal string
}

type roomInternal struct {
	RoomAvailability
	basePrice float64
}

func (r *repositoryDB) fetchBasicInfo(
	ctx context.Context,
	tx pgx.Tx,
	slug string,
	detail *Detail,
) error {
	return tx.QueryRow(ctx, `
        SELECT 
			p.id,
			p.name, 
			p.slug, 
			p.type, 
			p.check_in_from, 
			p.check_in_until, 
			p.check_out_from, 
			p.check_out_until, 
			co.code AS country_code, 
			ci.key AS city, 
			a.key AS area, 
			p.zip_code,
            p.avg_rating, 
			p.review_count, 
			p.about, 
			p.highlights, 
			p.area_info, 
			p.rules, 
			p.fine_print
        FROM properties p 
		LEFT JOIN areas a ON p.area_id = a.id
		LEFT JOIN cities ci ON a.city_id = ci.id
		LEFT JOIN provinces pr ON ci.province_id = pr.id
		LEFT JOIN countries co ON pr.country_id = co.id
		WHERE slug = $1 AND status = 'active'
    `, slug).Scan(
		&detail.ID, &detail.Name, &detail.Slug, &detail.Type, &detail.CheckInFrom, &detail.CheckInUntil, &detail.CheckOutFrom, &detail.CheckOutUntil, &detail.CountryCode,
		&detail.City, &detail.Area, &detail.ZipCode, &detail.AvgRating, &detail.ReviewCount,
		&detail.About, &detail.Highlights, &detail.AreaInfo, &detail.Rules, &detail.FinePrint,
	)
}

func (r *repositoryDB) fetchPropertyMetadata(
	ctx context.Context,
	tx pgx.Tx,
	detail *Detail,
) error {
	imgRows, err := tx.Query(
		ctx,
		`SELECT id, image_url, position, orientation FROM property_images WHERE property_id = $1 ORDER BY position`,
		detail.ID,
	)
	if err != nil {
		return err
	}
	defer imgRows.Close()
	for imgRows.Next() {
		var img Image
		if err := imgRows.Scan(
			&img.ID,
			&img.ImageUrl,
			&img.Position,
			&img.Orientation,
		); err != nil {
			return err
		}
		detail.Images = append(detail.Images, img)
	}

	fRows, _ := tx.Query(ctx, `
        SELECT fc.name, f.name FROM property_facilities pf 
        JOIN facilities f ON f.id = pf.facility_id 
        JOIN facility_categories fc ON fc.id = f.category_id 
        WHERE pf.property_id = $1`, detail.ID)
	defer fRows.Close()
	facMap := make(map[string][]string)
	for fRows.Next() {
		var cat, name string
		if err := fRows.Scan(&cat, &name); err != nil {
			return err
		}
		facMap[cat] = append(facMap[cat], name)
	}
	for k, v := range facMap {
		detail.Facilities = append(detail.Facilities, FacilityGroup{Category: k, Items: v})
	}

	return nil
}

func (r *repositoryDB) fetchAvailability(
	ctx context.Context, tx pgx.Tx, detail *Detail,
	checkIn, checkOut time.Time, adults, children, room, nights uint8, currency string,
) error {
	rows, err := tx.Query(ctx, `
        SELECT rt.id, rt.name, rt.base_price_usd, MIN(ri.available_rooms)
        FROM room_types rt
        JOIN room_inventory ri ON ri.room_type_id = rt.id
        WHERE rt.property_id = $1 AND ri.date >= $2 AND ri.date < $3
          AND rt.max_adults >= $4 AND rt.max_children >= $5
        GROUP BY rt.id HAVING MIN(ri.available_rooms) >= $6`,
		detail.ID, checkIn, checkOut, adults, children, room)
	if err != nil {
		return err
	}
	defer rows.Close()

	roomMap := make(map[uuid.UUID]*roomInternal)
	var roomIDs []uuid.UUID

	for rows.Next() {
		ri := &roomInternal{}
		if err := rows.Scan(&ri.RoomId, &ri.Name, &ri.basePrice, &ri.AvailableRooms); err != nil {
			return err
		}
		roomMap[ri.RoomId] = ri
		roomIDs = append(roomIDs, ri.RoomId)
	}
	if len(roomIDs) == 0 {
		return nil
	}

	if err := r.attachBeds(ctx, tx, roomIDs, roomMap); err != nil {
		return err
	}
	if err := r.attachRates(ctx, tx, roomIDs, roomMap, nights, currency); err != nil {
		return err
	}

	for _, ri := range roomMap {
		detail.Rooms = append(detail.Rooms, ri.RoomAvailability)
	}
	return nil
}

func (r *repositoryDB) attachBeds(
	ctx context.Context,
	tx pgx.Tx,
	ids []uuid.UUID,
	roomMap map[uuid.UUID]*roomInternal,
) error {
	rows, err := tx.Query(
		ctx,
		`SELECT room_type_id, bed_type, quantity FROM room_beds WHERE room_type_id = ANY($1)`,
		ids,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	bedStrings := make(map[uuid.UUID][]string)
	for rows.Next() {
		var id uuid.UUID
		var bType string
		var qty int
		if err := rows.Scan(&id, &bType, &qty); err != nil {
			return err
		}
		bedStrings[id] = append(bedStrings[id], fmt.Sprintf("%d %s", qty, bType))
	}
	for id, beds := range bedStrings {
		if room, ok := roomMap[id]; ok {
			room.BedInfo = strings.Join(beds, ", ")
		}
	}
	return nil
}

func (r *repositoryDB) attachRates(
	ctx context.Context,
	tx pgx.Tx,
	ids []uuid.UUID,
	roomMap map[uuid.UUID]*roomInternal,
	nights uint8,
	currency string,
) error {
	var rate float64
	err := r.db.QueryRow(ctx, `SELECT rate_to_usd FROM currencies WHERE code = $1`, currency).
		Scan(&rate)
	if err != nil {
		return err
	}

	rows, err := tx.Query(ctx, `
        SELECT rp.id, rp.room_type_id, rp.name, rp.refundable, rp.breakfast_included, rp.price_modifier_usd, rt.max_adults
        FROM rate_plans rp JOIN room_types rt ON rt.id = rp.room_type_id
        WHERE rp.room_type_id = ANY($1)`, ids)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var rp RatePlanItem
		var roomID uuid.UUID
		var modifier float64
		if err := rows.Scan(
			&rp.ID,
			&roomID,
			&rp.Name,
			&rp.Refundable,
			&rp.BreakfastIncluded,
			&modifier,
			&rp.MaxGuest,
		); err != nil {
			return err
		}

		if room, ok := roomMap[roomID]; ok {
			rp.Price = (room.basePrice + modifier) * rate * float64(nights)
			room.RatePlans = append(room.RatePlans, rp)
		}
	}
	return rows.Err()
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

// reserveRoomItem handles room verification, inventory locking, updates, and price calculations for a single room item.
func (r *repositoryDB) reserveRoomItem(
	ctx context.Context,
	tx pgx.Tx,
	room RoomRequestItem,
	checkIn, checkOut time.Time,
	propertyID uuid.UUID,
) (*ReservedRoomItem, float64, error) {
	var pricePerNightUSD float64
	var priceModifierUSD float64
	var roomName string

	roomNameQuery := `SELECT name FROM room_types WHERE id = $1`
	if err := tx.QueryRow(ctx, roomNameQuery, room.RoomTypeID).Scan(&roomName); err != nil {
		return nil, 0, err
	}

	priceModifierQuery := `SELECT price_modifier_usd FROM rate_plans WHERE id = $1`
	if err := tx.QueryRow(ctx, priceModifierQuery, room.RatePlanID).
		Scan(&priceModifierUSD); err != nil {
		return nil, 0, err
	}

	rows, err := tx.Query(ctx, `
		SELECT price_usd FROM room_inventory 
		WHERE room_type_id = $1 AND date >= $2 AND date < $3 
		AND available_rooms >= $4 
		ORDER BY date ASC FOR UPDATE`, room.RoomTypeID, checkIn, checkOut, room.Quantity)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to lock room inventory: %w", err)
	}

	var roomTotalUSD float64
	for rows.Next() {
		var priceUSD float64
		if scanErr := rows.Scan(&priceUSD); scanErr != nil {
			rows.Close()
			return nil, 0, fmt.Errorf("failed to scan price: %w", scanErr)
		}
		pricePerNightUSD = priceUSD + priceModifierUSD
		roomTotalUSD += pricePerNightUSD * float64(room.Quantity)
	}

	if err = rows.Err(); err != nil {
		rows.Close()
		return nil, 0, fmt.Errorf("error during row iteration: %w", err)
	}
	rows.Close()

	_, err = tx.Exec(ctx, `
		UPDATE room_inventory
		SET available_rooms = available_rooms - $1, updated_at = NOW()
		WHERE room_type_id = $2 AND date >= $3 AND date < $4`, room.Quantity, room.RoomTypeID, checkIn, checkOut)
	if err != nil {
		return nil, 0, err
	}

	_, err = tx.Exec(ctx, `
		UPDATE property_availability
		SET available_rooms = available_rooms - $1
		WHERE property_id = $2 AND date >= $3 AND date < $4`, room.Quantity, propertyID, checkIn, checkOut)
	if err != nil {
		return nil, 0, err
	}

	reservedRoom := &ReservedRoomItem{
		RoomTypeID:       room.RoomTypeID,
		RoomName:         roomName,
		RatePlanID:       room.RatePlanID,
		Quantity:         room.Quantity,
		PricePerNightUSD: decimal.NewFromFloat(pricePerNightUSD),
	}

	return reservedRoom, roomTotalUSD, nil
}
