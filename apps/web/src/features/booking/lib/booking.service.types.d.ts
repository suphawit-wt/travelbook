// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

interface RoomRequest {
  roomTypeId: string;
  ratePlanId: string;
  quantity: number;
}

export interface CreateBookingRequest {
  propertyId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  rooms: RoomRequest[];
  guests: {
    adults: number;
    children: number;
  };
}

export interface CreateBookingResponse {
  bookingId: string;
  expiresAt: string;
}
