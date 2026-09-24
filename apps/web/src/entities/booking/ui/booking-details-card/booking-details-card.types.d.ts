// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export interface BookingDetailsCardProps {
  checkInDate: string | null;
  checkOutDate: string | null;
  nights: number;
  guests: {
    adults: number;
    children: number;
  } | null;
  rooms: RoomBooking[] | null;
  totalRooms: number | null;
  variants?: 'info' | 'change-details';
}

interface RoomBooking {
  name: string;
  quantity: number;
}
