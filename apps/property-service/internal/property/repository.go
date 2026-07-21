// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

// Location represents the location details of a property, including country code, province, city, area, zip code, address lines, latitude, and longitude.
type Location struct {
	AreaID       string
	ZipCode      string
	AddressLine1 string
	AddressLine2 *string
	Latitude     float64
	Longitude    float64
}

// Description represents the descriptive details of a property, including the about section, highlights, and area information.
type Description struct {
	About    string
	Hilights Hilights
	AreaInfo AreaInfo
}

// Hilights represents the highlights of a property, including rooms with specific features and breakfast information.
type Hilights struct {
	RoomsWith     []string
	BreakfastInfo []string
}

// Policies represents the policies of a property, including rules and fine print information.
type Policies struct {
	Rules     Rules
	FinePrint *string
}

// Image represents the details of an image associated with a property, including its ID, storage key, URL, position, and orientation.
type Image struct {
	ID          string
	Key         string
	ImageUrl    string
	Position    uint8
	Orientation string
}

// CreatePropertyRoom represents the necessary information to create a new room for a property.
type CreatePropertyRoom struct {
	Name           string
	MaxAdults      uint8
	MaxChildren    uint8
	BasePriceCents int64
	TotalRooms     uint8
	Beds           []CreateBed
}

// CreateBed represents the details of a bed type and its quantity, used when creating rooms for a property.
type CreateBed struct {
	BedType  string
	Quantity uint8
}

// Repository defines the data access contract for property entities.
type Repository interface {
	Create(ctx context.Context, tx pgx.Tx, p *Property) (*Property, error)
	CreateImages(
		ctx context.Context,
		tx pgx.Tx,
		propertyID uuid.UUID,
		images []Image,
	) error
	CreateRoom(
		ctx context.Context,
		tx pgx.Tx,
		propertyID uuid.UUID,
		req *CreatePropertyRoom,
	) error
	UpdateLocation(
		ctx context.Context,
		tx pgx.Tx,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		location *Location,
	) error
	UpdateDescription(
		ctx context.Context,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		description *Description,
	) error
	UpdatePolicies(
		ctx context.Context,
		partnerID uuid.UUID,
		propertyID uuid.UUID,
		policy *Policies,
	) error
}

type repositoryDB struct {
	db  *pgxpool.Pool
	rdb *redis.Client
}

// NewRepositoryDB creates a new instance of RepositoryDB with the provided database connection pool.
func NewRepositoryDB(
	db *pgxpool.Pool,
	rdb *redis.Client,
) Repository {
	return &repositoryDB{db: db, rdb: rdb}
}

func (r *repositoryDB) Create(
	ctx context.Context,
	tx pgx.Tx,
	p *Property,
) (*Property, error) {
	propertyQuery := `
	INSERT INTO properties (
		id,
		name,
		slug,
		type,
		timezone,
		check_in_from,
		check_in_until,
		check_out_from,
		check_out_until,
		partner_id
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`

	_, err := tx.Exec(
		ctx,
		propertyQuery,
		p.ID,
		p.Name,
		p.Slug,
		p.Type,
		p.Timezone,
		p.CheckInFrom,
		p.CheckInUntil,
		p.CheckOutFrom,
		p.CheckOutUntil,
		p.PartnerID,
	)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r *repositoryDB) CreateImages(
	ctx context.Context,
	tx pgx.Tx,
	propertyID uuid.UUID,
	images []Image,
) error {
	batch := &pgx.Batch{}
	for _, img := range images {
		batch.Queue(`
            INSERT INTO property_images (
                id, property_id, key, image_url, position, orientation
            ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
			img.ID,
			propertyID,
			img.Key,
			img.ImageUrl,
			img.Position,
			img.Orientation,
		)
	}

	br := tx.SendBatch(ctx, batch)

	defer func() { _ = br.Close() }()

	for range images {
		if _, err := br.Exec(); err != nil {
			return err
		}
	}

	if err := br.Close(); err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) CreateRoom(
	ctx context.Context,
	tx pgx.Tx,
	propertyID uuid.UUID,
	req *CreatePropertyRoom,
) error {
	var currentMaxAdults, currentMaxChildren uint8
	queryCurrentMax := `
        SELECT COALESCE(MAX(max_adults), 0), COALESCE(MAX(max_children), 0)
        FROM room_types
        WHERE property_id = $1
    `
	if err := tx.QueryRow(ctx, queryCurrentMax, propertyID).
		Scan(&currentMaxAdults, &currentMaxChildren); err != nil {
		return fmt.Errorf("failed to fetch current max capacities: %w", err)
	}

	roomTypeID, uuidErr := uuid.NewV7()
	if uuidErr != nil {
		return fmt.Errorf("failed to generate id uuid v7: %w", uuidErr)
	}

	if err := r.insertRoomType(ctx, tx, roomTypeID, propertyID, req); err != nil {
		return err
	}

	if len(req.Beds) > 0 {
		if err := r.insertRoomBeds(ctx, tx, roomTypeID, req.Beds); err != nil {
			return err
		}
	}

	if err := r.syncInventory(ctx, tx, roomTypeID, propertyID, req); err != nil {
		return err
	}

	finalMaxAdults := currentMaxAdults
	if req.MaxAdults > currentMaxAdults {
		finalMaxAdults = req.MaxAdults
	}

	finalMaxChildren := currentMaxChildren
	if req.MaxChildren > currentMaxChildren {
		finalMaxChildren = req.MaxChildren
	}

	payloadMap := map[string]any{
		"max_adults":   finalMaxAdults,
		"max_children": finalMaxChildren,
	}

	payloadBytes, err := json.Marshal(payloadMap)
	if err != nil {
		return fmt.Errorf("failed to marshal outbox payload: %w", err)
	}

	outboxQuery := `
        INSERT INTO outbox (id, aggregate_type, aggregate_id, event_type, topic, payload)
        VALUES ($1, $2, $3, $4, $5, $6)
    `

	outboxID, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("failed to generate outbox id uuid v7: %w", err)
	}

	_, err = tx.Exec(
		ctx,
		outboxQuery,
		outboxID,
		"property",
		propertyID,
		"PropertyCapacityUpdated",
		"dev.property.inventory.search.v1",
		payloadBytes,
	)
	if err != nil {
		return fmt.Errorf("failed to insert outbox for capacity update: %w", err)
	}

	return nil
}

func (r *repositoryDB) UpdateLocation(
	ctx context.Context,
	tx pgx.Tx,
	partnerID, propertyID uuid.UUID,
	location *Location,
) error {
	areaID, err := uuid.Parse(location.AreaID)
	if err != nil {
		return err
	}

	query := `
	UPDATE properties
	SET
		area_id = $1,
		address_line1 = $2,
		address_line2 = $3,
		zip_code = $4,
		latitude = $5,
		longitude = $6,
		updated_at = $7
	WHERE id = $8
	AND partner_id = $9
	`

	_, err = tx.Exec(
		ctx,
		query,
		areaID,
		location.AddressLine1,
		location.AddressLine2,
		location.ZipCode,
		location.Latitude,
		location.Longitude,
		time.Now().UTC(),
		propertyID,
		partnerID,
	)
	if err != nil {
		return err
	}

	locNames, err := r.getLocationNamesByAreaID(ctx, tx, areaID)
	if err != nil {
		return err
	}

	payloadMap := map[string]any{
		"area_name_en":        locNames.AreaNameEN,
		"area_name_local":     locNames.AreaNameLocal,
		"city_name_en":        locNames.CityNameEN,
		"city_name_local":     locNames.CityNameLocal,
		"province_name_en":    locNames.ProvinceNameEN,
		"province_name_local": locNames.ProvinceNameLocal,
	}

	payloadBytes, err := json.Marshal(payloadMap)
	if err != nil {
		return fmt.Errorf("failed to marshal outbox payload for location update: %w", err)
	}

	outboxQuery := `
    INSERT INTO outbox (
        id, 
        aggregate_type, 
        aggregate_id, 
        event_type, 
        topic, 
        payload
    ) VALUES ($1, $2, $3, $4, $5, $6)
    `

	outboxID, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("failed to generate outbox id uuid v7: %w", err)
	}

	_, err = tx.Exec(
		ctx,
		outboxQuery,
		outboxID,
		"property",
		propertyID,
		"PropertyLocationUpdated",
		"dev.property.inventory.search.v1",
		payloadBytes,
	)
	if err != nil {
		return fmt.Errorf("failed to insert outbox record for location update: %w", err)
	}

	return nil
}

func (r *repositoryDB) UpdateDescription(
	ctx context.Context,
	partnerID, propertyID uuid.UUID,
	description *Description,
) error {
	query := `
	UPDATE properties
	SET
		about = $1,
		highlights = $2,
		area_info = $3,
		updated_at = $4
	WHERE id = $5
	AND partner_id = $6
	`

	_, err := r.db.Exec(
		ctx,
		query,
		description.About,
		description.Hilights,
		description.AreaInfo,
		time.Now().UTC(),
		propertyID,
		partnerID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (r *repositoryDB) UpdatePolicies(
	ctx context.Context,
	partnerID, propertyID uuid.UUID,
	policy *Policies,
) error {
	query := `
	UPDATE properties
	SET
		rules = $1,
		fine_print = $2,
		updated_at = $3
	WHERE id = $4
	AND partner_id = $5
	`

	_, err := r.db.Exec(
		ctx,
		query,
		policy.Rules,
		policy.FinePrint,
		time.Now().UTC(),
		propertyID,
		partnerID,
	)
	if err != nil {
		return err
	}

	return nil
}
