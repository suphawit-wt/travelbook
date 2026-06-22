// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package auth

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/config"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/enums/api"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/errs"
	"github.com/suphawit-wt/travelbook/pkg/go-libs/validator"
	"github.com/suphawit-wt/travelbook/pkg/shared/jwtkey"
)

// Handler defines HTTP request handler methods for user authentication, partner authentication, and system health checks.
type Handler interface {
	UserSignInWithEmail(c *gin.Context)
	UserSignInWithGoogle(c *gin.Context)
	UserSignOut(c *gin.Context)
	UserVerifyEmail(c *gin.Context)
	UserRefreshToken(c *gin.Context)

	PartnerSignIn(c *gin.Context)
	PartnerSignUp(c *gin.Context)
	PartnerVerify(c *gin.Context)
	PartnerRefreshToken(c *gin.Context)

	HealthCheck(c *gin.Context)
}

type handler struct {
	vdt     *validator.Instance
	cfg     *config.Config
	jwtKeys *jwtkey.Keys
	svc     Service
}

// NewHandler creates a new instance of AuthHandler with the provided dependencies.
func NewHandler(
	vdt *validator.Instance,
	cfg *config.Config,
	jwtKeys *jwtkey.Keys,
	svc Service,
) Handler {
	return &handler{vdt: vdt, cfg: cfg, jwtKeys: jwtKeys, svc: svc}
}

// UserSignInWithEmail godoc
//
//	@Summary		Sign in user
//	@Description	Authenticate user and return access + refresh token
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UserSignInRequest	true	"User credentials"
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/sign-in [post]
func (h *handler) UserSignInWithEmail(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req UserSignInRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err := h.svc.UserSignInWithEmail(ctx, req.Email); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "OTP was sent to the user's email.",
	}

	c.JSON(http.StatusOK, res)
}

// UserSignInWithGoogle godoc
//
//	@Summary		Sign in user with Google
//	@Description	Authenticate user using Google ID token and return access + refresh token
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		GoogleSignInRequest	true	"Google Id token payload"
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		401	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/google [post]
func (h *handler) UserSignInWithGoogle(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req GoogleSignInRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	token, err := h.svc.UserSignInWithGoogleOAuth(
		ctx,
		req.AuthCode,
		c.ClientIP(),
		c.Request.UserAgent(),
	)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       &TokenResponse{AccessToken: token.AccessToken},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		UserRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// UserSignOut godoc
//
//	@Summary		Sign out user
//	@Description	Invalidate user session and clear authentication cookies
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse
//	@Failure		401	{object}	ApiResponse	"Unauthorized"
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/sign-out [post]
func (h *handler) UserSignOut(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	refreshToken, err := c.Cookie(UserRefreshTokenCookieKey)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			errs.GinHandleError(
				c,
				errs.NewUnauthorizedError(
					"Authentication session expired or missing.",
				),
			)
			return
		}

		errs.GinHandleError(c, err)
		return
	}

	if err := h.svc.SignOut(
		ctx,
		refreshToken,
		h.jwtKeys.User.Refresh.Public,
		ClientTypeCustomer,
	); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Message:    "Sign Out Successfully.",
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(UserRefreshTokenCookieKey, "", -1, "/", h.cfg.Cookie.Domain, true, true)

	c.JSON(http.StatusOK, res)
}

// UserVerifyEmail godoc
//
//	@Summary		Verify user email
//	@Description	Verify user using otp token by email verification
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		UserVerifyEmailRequest	true	"Verification payload (OTP token)"
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		401	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/verify-email [post]
func (h *handler) UserVerifyEmail(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req UserVerifyEmailRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	token, err := h.svc.UserVerifyEmail(
		ctx,
		req.Email,
		req.OTP,
		c.ClientIP(),
		c.Request.UserAgent(),
	)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data: &TokenResponse{
			AccessToken: token.AccessToken,
		},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		UserRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// UserRefreshToken godoc
//
//	@Summary		Refresh user token pair
//	@Description	Generate a new access token using a valid refresh token (from HTTP-only cookie)
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		401	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/user/refresh [post]
func (h *handler) UserRefreshToken(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	refreshToken, err := c.Cookie(UserRefreshTokenCookieKey)
	if err != nil {
		if err == http.ErrNoCookie {
			errs.GinHandleError(
				c,
				errs.NewUnauthorizedError("Authentication session expired or missing."),
			)
			return
		}

		errs.GinHandleError(c, err)
		return
	}

	keys := RotateKeys{
		AccessPrivateKey:  h.jwtKeys.User.Access.Private,
		RefreshPrivateKey: h.jwtKeys.User.Refresh.Private,
		RefreshPublicKey:  h.jwtKeys.User.Refresh.Public,
	}

	token, err := h.svc.RotateTokens(ctx, refreshToken, ClientTypeCustomer, keys)
	if err != nil {
		if appErr, ok := err.(errs.AppError); ok {
			if appErr.Status == api.StatusUnauthorized {
				c.SetSameSite(http.SameSiteLaxMode)
				c.SetCookie(
					UserRefreshTokenCookieKey,
					"",
					-1,
					"/",
					h.cfg.Cookie.Domain,
					true,
					true,
				)
			}
		}

		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       &TokenResponse{AccessToken: token.AccessToken},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		UserRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// PartnerSignIn godoc
//
//	@Summary		Sign in partner
//	@Description	Authenticate partner and return access + refresh token
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		PartnerSignInRequest	true	"Partner credentials"
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		401	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/partner/sign-in [post]
func (h *handler) PartnerSignIn(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req PartnerSignInRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	token, err := h.svc.PartnerSignInWithUsernamePassword(
		ctx,
		req.UsernameOrEmail,
		req.Password,
		c.ClientIP(),
		c.Request.UserAgent(),
	)
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       &TokenResponse{AccessToken: token.AccessToken},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		PartnerRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// PartnerSignUp godoc
//
//	@Summary		Sign up partner
//	@Description	Register a new partner account
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		PartnerSignUpRequest	true	"Partner registration payload"
//	@Success		201	{object}	ApiResponse
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		409	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/partner/sign-up [post]
func (h *handler) PartnerSignUp(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req PartnerSignUpRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	if err := h.svc.PartnerSignUpWithUsernamePassword(ctx, &req); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponse{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusCreated,
		Message:    "Verify mail was sent to the partner's email.",
	}

	c.JSON(http.StatusCreated, res)
}

// PartnerVerify godoc
//
//	@Summary		Verify partner
//	@Description	Verify partner using JWT token (e.g. email verification or account activation)
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			req	body		PartnerVerifyRequest	true	"Verification payload (JWT token)"
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse{errors=ErrResponse}
//	@Failure		401	{object}	ApiResponse
//	@Failure		404	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/partner/verify [post]
func (h *handler) PartnerVerify(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	var req PartnerVerifyRequest

	if err := errs.GinBindAndValidate(c, &req, h.vdt); err != nil {
		errs.GinHandleError(c, err)
		return
	}

	token, err := h.svc.PartnerVerifyEmail(ctx, req.Token, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       &TokenResponse{AccessToken: token.AccessToken},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		PartnerRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// PartnerRefreshToken godoc
//
//	@Summary		Refresh partner token pair
//	@Description	Generate a new access token using a valid refresh token (from HTTP-only cookie)
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ApiResponseWithData{data=TokenResponse}
//	@Failure		400	{object}	ApiResponse
//	@Failure		401	{object}	ApiResponse
//	@Failure		500	{object}	ApiResponse
//	@Router			/v1/auth/partner/refresh [post]
func (h *handler) PartnerRefreshToken(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	refreshToken, err := c.Cookie(PartnerRefreshTokenCookieKey)
	if err != nil {
		if err == http.ErrNoCookie {
			errs.GinHandleError(
				c,
				errs.NewUnauthorizedError("Authentication session expired or missing."),
			)
			return
		}

		errs.GinHandleError(c, err)
		return
	}

	keys := RotateKeys{
		AccessPrivateKey:  h.jwtKeys.Partner.Access.Private,
		RefreshPrivateKey: h.jwtKeys.Partner.Refresh.Private,
		RefreshPublicKey:  h.jwtKeys.Partner.Refresh.Public,
	}

	token, err := h.svc.RotateTokens(ctx, refreshToken, ClientTypePartner, keys)
	if err != nil {
		if appErr, ok := err.(errs.AppError); ok {
			if appErr.Status == api.StatusUnauthorized {
				c.SetSameSite(http.SameSiteLaxMode)
				c.SetCookie(
					PartnerRefreshTokenCookieKey,
					"",
					-1,
					"/",
					h.cfg.Cookie.Domain,
					true,
					true,
				)
			}
		}

		errs.GinHandleError(c, err)
		return
	}

	res := ApiResponseWithData[*TokenResponse]{
		Status:     api.StatusSuccess,
		StatusCode: http.StatusOK,
		Data:       &TokenResponse{AccessToken: token.AccessToken},
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		PartnerRefreshTokenCookieKey,
		token.RefreshToken,
		int(h.cfg.Auth.RefreshTTL.Seconds()),
		"/",
		h.cfg.Cookie.Domain,
		true,
		true,
	)

	c.JSON(http.StatusOK, res)
}

// HealthCheck is a simple health check endpoint to verify that the service is running.
func (h *handler) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
