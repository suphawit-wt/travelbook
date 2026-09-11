// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { createSelector } from 'reselect';

import type { RootState } from '@/shared/store/store';

export const selectBooking = (state: RootState) => state.booking;

export const selectSelectedRooms = createSelector(
  selectBooking,
  (booking) => booking.selectedRooms,
);

export const selectBookingSummary = createSelector(
  [selectSelectedRooms],
  (selectedRooms) => {
    const rooms = Object.values(selectedRooms);

    const total = rooms.reduce((sum, r) => sum + r.price * r.quantity, 0);

    const totalRooms = rooms.reduce((sum, r) => sum + r.quantity, 0);

    return { total, totalRooms };
  },
);
