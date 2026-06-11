// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { createSelector } from 'reselect';

import type { RootState } from '@/shared/store/store';

const selectAuth = (state: RootState) => state.auth;

export const selectAccessToken = createSelector(
  selectAuth,
  (auth) => auth.accessToken,
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated,
);
