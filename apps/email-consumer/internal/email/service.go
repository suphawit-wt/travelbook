// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

package email

import (
	"context"

	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/sendgrid/sendgrid-go/v4"
	"go.uber.org/zap"

	"github.com/suphawit-wt/travelbook/pkg/go-libs/zaplog"
)

// Service defines the interface for sending emails related to user authentication.
type Service interface {
	SendSignInOTP(ctx context.Context, email, otp string) error
	SendSignUpOTP(ctx context.Context, email, otp string) error
}

type service struct {
	logger   *zaplog.Logger
	sgClient *sendgrid.Client
}

// NewService creates a new instance of Email Service with the provided SendGrid client.
func NewService(logger *zaplog.Logger, sgClient *sendgrid.Client) Service {
	return &service{logger: logger, sgClient: sgClient}
}

func (s *service) SendSignInOTP(
	ctx context.Context,
	email, otp string,
) error {
	logger := s.logger.Named("send_sign_in_otp")

	from := mail.NewEmail("Travelbook", "no-reply@travelbook.suphawit.dev")
	to := mail.NewEmail(email, email)

	m := mail.NewV3Mail()
	m.SetFrom(from)

	p := mail.NewPersonalization()
	p.AddTos(to)

	p.SetDynamicTemplateData("userEmail", email)
	p.SetDynamicTemplateData("userOTP", otp)

	m.AddPersonalizations(p)

	m.SetTemplateID("d-b8495715595e43c78433e2a14a4a3763")

	_, err := s.sgClient.Send(m)
	if err != nil {
		logger.Error("Failed to send sign-in OTP", zap.Error(err))
		return err
	}

	logger.Info("Successfully sent sign-in OTP email", zap.String("email", email))
	return nil
}

func (s *service) SendSignUpOTP(
	ctx context.Context,
	email, otp string,
) error {
	logger := s.logger.Named("send_sign_up_otp")

	from := mail.NewEmail("Travelbook", "no-reply@travelbook.suphawit.dev")
	to := mail.NewEmail(email, email)

	m := mail.NewV3Mail()
	m.SetFrom(from)

	p := mail.NewPersonalization()
	p.AddTos(to)

	p.SetDynamicTemplateData("userEmail", email)
	p.SetDynamicTemplateData("userOTP", otp)

	m.AddPersonalizations(p)

	m.SetTemplateID("d-07cde0c265694c0bb1ffb3596665f53c")

	_, err := s.sgClient.Send(m)
	if err != nil {
		logger.Error("Failed to send sign-up OTP", zap.Error(err))
		return err
	}

	logger.Info("Successfully sent sign-up OTP email", zap.String("email", email))
	return nil
}
