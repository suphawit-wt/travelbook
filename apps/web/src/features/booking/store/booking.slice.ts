// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SelectedRoom {
  roomTypeId: string;
  ratePlanId: string;
  quantity: number;
  price: number;
}

interface BookingMetaPayload {
  propertyId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: {
    adults: number;
    children: number;
  };
}

interface BookingState {
  propertyId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: {
    adults: number;
    children: number;
  };
  selectedRooms: Record<string, SelectedRoom>;
}

const initialState: BookingState = {
  propertyId: null,
  checkIn: null,
  checkOut: null,
  guests: { adults: 0, children: 0 },
  selectedRooms: {},
};

const bookingSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBookingMeta(state, action: PayloadAction<BookingMetaPayload>) {
      const { propertyId, checkIn, checkOut, guests } = action.payload;
      state.propertyId = propertyId;
      state.checkIn = checkIn;
      state.checkOut = checkOut;
      state.guests = guests;
    },

    setRoomQuantity(state, action: PayloadAction<SelectedRoom>) {
      const { roomTypeId, ratePlanId, quantity, price } = action.payload;

      if (quantity === 0) {
        const { [ratePlanId]: _, ...remainingRooms } = state.selectedRooms;
        state.selectedRooms = remainingRooms;
        return;
      }

      state.selectedRooms[ratePlanId] = {
        roomTypeId,
        ratePlanId,
        quantity,
        price,
      };
    },

    clearBooking(state) {
      state.selectedRooms = {};
    },
  },
});

export const { setBookingMeta, setRoomQuantity, clearBooking } =
  bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;
