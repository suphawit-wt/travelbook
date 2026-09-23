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

export interface GetBookingByIdResponse {
  property: PropertyInfoResponse;
  booking: BookingInfoResponse;
}

export interface PropertyInfoResponse {
  name: string;
  type: string;
  avgRating: number;
  reviewCount: number;
  countryCode: string;
  city: string;
  area: string;
  zipCode: string;
}

export interface BookingInfoResponse {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: GuestResponse;
  rooms: RoomBookingInfoResponse[];
  totalRooms: number;
  totalPrice: number;
  taxesAndFees: number;
  freeCancelDate: string;
}

export interface GuestResponse {
  adults: number;
  children: number;
}

export interface RoomBookingInfoResponse {
  name: string;
  quantity: number;
}

export interface UpdateBookingDetailsRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  guestName: string;
  specialRequests: string;
}
