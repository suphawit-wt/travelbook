// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { Currency } from '@/shared/types/store';

const getInitialCurrency = (): Currency => {
  let storedCurrency: Currency | null = null;

  if (typeof window !== 'undefined') {
    storedCurrency = localStorage.getItem('currency') as Currency | null;
  }

  if (!storedCurrency) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', 'USD');
    }

    return 'USD';
  }

  return storedCurrency;
};

interface UserPreferencesState {
  currency: Currency;
}

const initialState: UserPreferencesState = {
  currency: getInitialCurrency(),
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = userPreferencesSlice.actions;
export const userPreferencesReducer = userPreferencesSlice.reducer;
