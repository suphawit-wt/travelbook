// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  CreateBookingRequest,
  CreateBookingResponse,
  GetBookingByIdResponse,
  GetBookingConfirmationDetailsResponse,
  UpdateBookingDetailsRequest,
} from './booking.service.types';

export interface BookingServiceInterface {
  getBookingById: (
    bookingId: string,
    currency: string,
  ) => Promise<GetBookingByIdResponse>;
  getBookingConfirmationDetails: (
    bookingId: string,
    currency: string,
  ) => Promise<GetBookingConfirmationDetailsResponse>;
  createBooking: (
    req: CreateBookingRequest,
    currency: string,
  ) => Promise<CreateBookingResponse>;
  updateBookingDetails: (
    bookingId: string,
    req: UpdateBookingDetailsRequest,
  ) => Promise<void>;
}
