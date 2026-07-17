// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"fmt"

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
