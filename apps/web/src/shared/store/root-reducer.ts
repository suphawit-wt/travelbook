// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { combineReducers } from '@reduxjs/toolkit';

import { userPreferencesReducer } from '@/features/user/store/user-preferences.slice';

export const rootReducer = combineReducers({
  userPreferences: userPreferencesReducer,
});
