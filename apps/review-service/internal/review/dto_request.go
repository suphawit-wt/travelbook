// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package review

import "github.com/google/uuid"

// GetReviewsByPropertyIDURI represents the URI parameter for fetching reviews by property ID.
type GetReviewsByPropertyIDURI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// CreateReviewRequest represents the request body for creating a review.
type CreateReviewRequest struct {
	PropertyID string      `json:"propertyId"           binding:"required,uuid"`
	BookingID  string      `json:"bookingId"            binding:"required,uuid"`
	Rating     int16       `json:"rating"               binding:"required,gte=1,lte=10"`
	SubRatings *SubRatings `json:"subRatings,omitempty"`
	Comment    *string     `json:"comment,omitempty"    binding:"omitempty,max=500"`
}

// ToDomain maps a CreateReviewRequest DTO to a domain Review entity.
func (r *CreateReviewRequest) ToDomain(
	userID uuid.UUID,
	displayName, countryCode *string,
) (*Review, error) {
	propID, err := uuid.Parse(r.PropertyID)
	if err != nil {
		return nil, err
	}
	bookID, err := uuid.Parse(r.BookingID)
	if err != nil {
		return nil, err
	}

	sub := SubRatings{}
	if r.SubRatings != nil {
		sub = SubRatings{
			Staff:       r.SubRatings.Staff,
			Cleanliness: r.SubRatings.Cleanliness,
			Facilities:  r.SubRatings.Facilities,
			Comfort:     r.SubRatings.Comfort,
			Value:       r.SubRatings.Value,
			Location:    r.SubRatings.Location,
			Wifi:        r.SubRatings.Wifi,
		}
	}

	return &Review{
		PropertyID:      propID,
		BookingID:       bookID,
		UserID:          userID,
		UserDisplayName: displayName,
		UserCountryCode: countryCode,
		Rating:          r.Rating,
		SubRatings:      sub,
		Comment:         r.Comment,
	}, nil
}
