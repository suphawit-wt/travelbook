// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package user

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

// Handler defines HTTP request handler methods for user.
type Handler interface {
	GetUserInfo(c *gin.Context)
	GetNavbarInfo(c *gin.Context)
	UploadAvatar(c *gin.Context)
	UpdateName(c *gin.Context)
	UpdateDisplayName(c *gin.Context)
	UpdatePhoneNumber(c *gin.Context)
	UpdateDateOfBirth(c *gin.Context)
	UpdateNationality(c *gin.Context)
	UpdateGender(c *gin.Context)
	UpdateAddress(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt     *validator.Instance
	userSvc Service
}

// NewHandler creates a new instance of Handler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	userSvc Service,
) Handler {
	return &handler{vdt: vdt, userSvc: userSvc}
}

// GetUserInfo godoc
//
//	@Summary		Get user by id
//	@Description	Get a single user by id
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=Response}
//	@Failure		400	{object}	ApiResponse
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me [get]
func (h *handler) GetUserInfo(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	user, err := h.userSvc.GetUserById(ctx, userID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	var userResponse Response

	res := ApiResponseWithData[*Response]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       userResponse.FromEntity(user),
	}

	c.JSON(http.StatusOK, res)
}

// GetNavbarInfo godoc
//
//	@Summary		Get user navbar info
//	@Description	Get a user's navbar info
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=NavbarInfoResponse}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/navbar-info [get]
func (h *handler) GetNavbarInfo(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	navbarInfo, err := h.userSvc.GetNavbarInfo(ctx, userID)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*NavbarInfoResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data: &NavbarInfoResponse{
			AvatarURL:  navbarInfo.AvatarURL,
			GeniusTier: navbarInfo.GeniusTier,
		},
	}

	c.JSON(http.StatusOK, res)
}

// UploadAvatar godoc
//
//	@Summary		Upload user avatar
//	@Description	Upload and update the authenticated user's avatar image.
//	@Description	Supported formats: jpg, jpeg, png, webp. Max size: 2MB.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			avatar	formData	file										true	"Avatar image file (max 2MB)"
//	@Success		200		{object}	ApiResponseWithData{data=AvatarResponse}	"Avatar uploaded successfully"
//	@Failure		400		{object}	ApiResponse
//	@Failure		413		{object}	ApiResponse	"File too large"
//	@Failure		415		{object}	ApiResponse	"Unsupported file type"
//	@Failure		500		{object}	ApiResponse	"Internal server error"
//	@Router			/v1/users/me/avatar [post]
func (h *handler) UploadAvatar(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	// Limit request to 2 MB
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 2<<20)

	fileHeader, err := c.FormFile("avatar")
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("no avatar file uploaded"))
		return
	}

	avatarURL, err := h.userSvc.UploadAvatar(ctx, userID, fileHeader)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*AvatarResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data: &AvatarResponse{
			AvatarURL: avatarURL,
		},
	}

	c.JSON(http.StatusOK, res)
}

// UpdateName godoc
//
//	@Summary		Update user name
//	@Description	Update the authenticated user's name.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateNameRequest	true	"UpdateNameRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/name [patch]
func (h *handler) UpdateName(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateNameRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdateName(ctx, userID, req.FirstName, req.LastName); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Name Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateDisplayName godoc
//
//	@Summary		Update user display name
//	@Description	Update the authenticated user's display name.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateDisplayNameRequest	true	"UpdateDisplayNameRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/display-name [patch]
func (h *handler) UpdateDisplayName(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateDisplayNameRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdateDisplayName(ctx, userID, req.DisplayName); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Display Name Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdatePhoneNumber godoc
//
//	@Summary		Update user phone number
//	@Description	Update the authenticated user's phone number.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdatePhoneNumberRequest	true	"UpdatePhoneNumberRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/phone-number [patch]
func (h *handler) UpdatePhoneNumber(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdatePhoneNumberRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdatePhoneNumber(ctx, userID, req.PhoneNumber); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Phone number Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateDateOfBirth godoc
//
//	@Summary		Update user date of birth
//	@Description	Update the authenticated user's date of birth. Date format must be YYYY-MM-DD.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateDateOfBirthRequest	true	"UpdateDateOfBirthRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/date-of-birth [patch]
func (h *handler) UpdateDateOfBirth(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateDateOfBirthRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	dateOfBirth, err := time.Parse(time.DateOnly, req.DateOfBirth)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("Invalid date format"))
		return
	}

	if err = h.userSvc.UpdateDateOfBirth(ctx, userID, dateOfBirth); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Personal details Date of birth Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateNationality godoc
//
//	@Summary		Update user nationality
//	@Description	Update the authenticated user's nationality.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateNationalityRequest	true	"UpdateNationalityRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=[]ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/nationality [patch]
func (h *handler) UpdateNationality(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateNationalityRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdateNationality(ctx, userID, req.Nationality); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Personal Details Nationality Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateGender godoc
//
//	@Summary		Update user gender
//	@Description	Update the authenticated user's gender.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateGenderRequest	true	"UpdateGenderRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/gender [patch]
func (h *handler) UpdateGender(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateGenderRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdateGender(ctx, userID, req.Gender); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Personal Details Gender Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// UpdateAddress godoc
//
//	@Summary		Update user address
//	@Description	Update the authenticated user's address.
//	@Tags			Users
//	@Security		Bearer
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UpdateAddressRequest	true	"UpdateAddressRequest"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/users/me/address [patch]
func (h *handler) UpdateAddress(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	userIDStr, ok := c.MustGet("userID").(string)
	if !ok {
		errs.GinHandleError(c, errs.NewUnexpectedError())
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		errs.GinHandleError(c, errs.NewBadRequestError("invalid uuid format"))
		return
	}

	var req UpdateAddressRequest

	if err = errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err = h.userSvc.UpdateAddress(ctx, userID, &Address{
		CountryCode:  req.CountryCode,
		AddressLine1: req.AddressLine1,
		City:         req.City,
		ZipCode:      req.ZipCode,
	}); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Update Address Successfully.",
	}

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
