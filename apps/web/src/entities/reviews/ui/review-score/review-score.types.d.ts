// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { type ReviewsGroup } from './review-score.styled';

import type { ComponentPropsWithoutRef } from 'react';

export interface ReviewScoreProps extends ComponentPropsWithoutRef<
  typeof ReviewsGroup
> {
  location: number;
  cleanliness: number;
  valueOfMoney: number;
  facilities: number;
  comfort: number;
  staff: number;
  wifi: number;
  $variants?: 'portrait' | 'portrait-compact' | 'landscape';
}
