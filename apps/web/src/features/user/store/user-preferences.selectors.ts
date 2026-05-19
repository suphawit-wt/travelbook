// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { createSelector } from 'reselect';

import type { RootState } from '@/shared/store/store';

const selectUserPreferences = (state: RootState) => state.userPreferences;

export const selectCurrency = createSelector(
  selectUserPreferences,
  (userPreferences) => userPreferences.currency,
);
