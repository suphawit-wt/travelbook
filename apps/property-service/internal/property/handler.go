// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package property

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
)

// Handler defines the HTTP interface for handling property-related HTTP requests.
type Handler interface {
	CreateProperty(c *gin.Context)
	CreatePropertyImages(c *gin.Context)
	GenerateImageUploadURLs(c *gin.Context)
	UpdateLocation(c *gin.Context)
	UpdateDescription(c *gin.Context)
	UpdatePolicies(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt         *validator.Instance
	propertySvc Service
}

// NewHandler creates a new instance of Handler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	propertySvc Service,
) Handler {
	return &handler{vdt: vdt, propertySvc: propertySvc}
}

// CreateProperty godoc
//
//	@Summary		Create property
//	@Description	Create a new property
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		CreatePropertyRequest	true	"CreatePropertyRequest"
//	@Success		201	{object}	ApiResponseWithData{data=CreatePropertyResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties [post]
func (h *handler) CreateProperty(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	partnerIDStr, ok := c.MustGet("partnerID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	partnerID, err := uuid.Parse(partnerIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	var req CreatePropertyRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	createReq, err := req.ToDomain(partnerID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	property, err := h.propertySvc.CreateProperty(ctx, createReq)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*CreatePropertyResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Data: &CreatePropertyResponse{
			Id:       property.ID.String(),
			Name:     property.Name,
			Slug:     property.Slug,
			Type:     property.Type,
			Timezone: property.Timezone,
		},
	}

	c.JSON(http.StatusCreated, res)
}

// CreatePropertyImages godoc
//
//	@Summary		Create property images
//	@Description	Create a new property images.
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string						true	"Property ID (UUID)"
//	@Param			req	body		CreatePropertyImagesRequest	true	"CreatePropertyImagesRequest"
//	@Success		201	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties/{id}/images [post]
func (h *handler) CreatePropertyImages(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri URI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid property ID format."))
		return
	}

	var req CreatePropertyImagesRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.propertySvc.CreatePropertyImages(ctx, propertyID, req.ToDomainModel()); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Message:    "Create Property images successfully.",
	}

	c.JSON(http.StatusCreated, res)
}

// GenerateImageUploadURLs godoc
//
//	@Summary		Generate image upload URLs
//	@Description	Generate presigned URLs for uploading property images to file storage.
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string							true	"Property ID (UUID)"
//	@Param			req	body		GenerateImageUploadURLsRequest	true	"GenerateImageUploadURLsRequest"
//	@Success		201	{object}	ApiResponseWithData{data=GenerateImageUploadURLsResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties/{id}/images/presigned-urls [post]
func (h *handler) GenerateImageUploadURLs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var uri URI

	if err := c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid property ID format."))
		return
	}

	var req GenerateImageUploadURLsRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = validateUploadFiles(req.Files); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	uploadURLs, err := h.propertySvc.GenerateImageUploadURLs(ctx, propertyID, req.ToDomain())
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*GenerateImageUploadURLsResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       GenerateImageUploadURLsResponse{}.FromDomainModel(uploadURLs),
	}

	c.JSON(http.StatusOK, res)
}

// UpdateLocation godoc
//
//	@Summary		Update property location
//	@Description	Update the location details of an existing property, including address, city, state, postal code, and country.
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string							true	"Property ID (UUID)"
//	@Param			req	body		UpdatePropertyLocationRequest	true	"UpdatePropertyLocationRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties/{id}/location [patch]
func (h *handler) UpdateLocation(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	partnerIDStr, ok := c.MustGet("partnerID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	partnerID, err := uuid.Parse(partnerIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	var uri URI

	if err = c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid property ID format."))
		return
	}

	var req UpdatePropertyLocationRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.propertySvc.UpdateLocation(
		ctx,
		partnerID,
		propertyID,
		req.ToDomain(),
	); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Property Location Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateDescription godoc
//
//	@Summary		Update property description
//	@Description	Update the description of an existing property.
//	@Tags			Properties
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string								true	"Property ID (UUID)"
//	@Param			req	body		UpdatePropertyDescriptionRequest	true	"UpdatePropertyDescriptionRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties/{id}/descripion [patch]
func (h *handler) UpdateDescription(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	partnerIDStr, ok := c.MustGet("partnerID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	partnerID, err := uuid.Parse(partnerIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	var uri URI

	if err = c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid property ID format."))
		return
	}

	var req UpdatePropertyDescriptionRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.propertySvc.UpdateDescription(
		ctx,
		partnerID,
		propertyID,
		req.ToDomain(),
	); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Property Description Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdatePolicies godoc
//
//	@Summary		Update property policies
//	@Description	Update the policies of an existing property, including cancellation policy, house rules, and health and safety measures.
//	@Security		Bearer
//	@Tags			Properties
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string							true	"Property ID (UUID)"
//	@Param			req	body		UpdatePropertyPoliciesRequest	true	"UpdatePropertyPoliciesRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/properties/{id}/policies [patch]
func (h *handler) UpdatePolicies(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	partnerIDStr, ok := c.MustGet("partnerID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	partnerID, err := uuid.Parse(partnerIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid partner ID format."))
		return
	}

	var uri URI

	if err = c.ShouldBindUri(&uri); err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid URI format."))
		return
	}

	propertyID, err := uuid.Parse(uri.ID)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid property ID format."))
		return
	}

	var req UpdatePropertyPoliciesRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.propertySvc.UpdatePolicies(
		ctx,
		partnerID,
		propertyID,
		req.ToDomain(),
	); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Property Policies Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
