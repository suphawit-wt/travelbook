// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

// CreatePropertyResponse defines the structure of the response returned after successfully creating a property.
type CreatePropertyResponse struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	Type     Type   `json:"type"`
	Timezone string `json:"timezone"`
}

// GenerateImageUploadURLsResponse defines the structure of the response returned after generating presigned URLs for image uploads.
type GenerateImageUploadURLsResponse struct {
	Uploads []ImageUploadURLsResponse `json:"uploads"`
}

// ImageUploadURLsResponse defines the structure of each individual image upload URL response, including the presigned URL and the final image URL after upload.
type ImageUploadURLsResponse struct {
	Id        string `json:"id"`
	Key       string `json:"key"`
	UploadUrl string `json:"uploadUrl"`
	ImageUrl  string `json:"imageUrl"`
}

// FromDomainModel converts a slice of ImageUpload to a GenerateImageUploadURLsResponse, mapping the relevant fields for the API response.
func (r GenerateImageUploadURLsResponse) FromDomainModel(
	uploads []ImageUpload,
) *GenerateImageUploadURLsResponse {
	uploadResponses := make([]ImageUploadURLsResponse, len(uploads))

	for i, upload := range uploads {
		uploadResponses[i] = ImageUploadURLsResponse{
			Id:        upload.ID,
			Key:       upload.Key,
			UploadUrl: upload.UploadURL,
			ImageUrl:  upload.ImageURL,
		}
	}

	return &GenerateImageUploadURLsResponse{Uploads: uploadResponses}
}

// ApiResponse represents the standard structure for API responses, including status, status code, message, and optional error details.
type ApiResponse struct {
	Status     string        `json:"status"`
	StatusCode int           `json:"statusCode"`
	Message    string        `json:"message"`
	Errors     []ErrResponse `json:"errors,omitempty" swaggerignore:"true"`
}

// ApiResponseWithData represents the standard structure for API responses that include data, along with status and status code.
type ApiResponseWithData[T any] struct {
	Status     string `json:"status"`
	StatusCode int    `json:"statusCode"`
	Data       T      `json:"data"       swaggerignore:"true"`
}

// ApiResponseWithDataAndPagination includes both data and pagination metadata for API responses
type ApiResponseWithDataAndPagination[T any] struct {
	Data       T               `json:"data"                 swaggerignore:"true"`
	Pagination *PaginationMeta `json:"pagination,omitempty"`
	Status     string          `json:"status"`
	StatusCode int             `json:"statusCode"`
}

// PaginationMeta provides metadata for paginated responses, indicating the current page, items per page, and whether there are next or previous pages.
type PaginationMeta struct {
	Page       int  `json:"page,omitempty"`
	PerPage    int  `json:"perPage,omitempty"`
	TotalCount int  `json:"totalCount"`
	HasNext    bool `json:"hasNext"`
	HasPrev    bool `json:"hasPrev,omitempty"`
}

// ErrResponse represents the structure for individual error responses within the API.
type ErrResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}
