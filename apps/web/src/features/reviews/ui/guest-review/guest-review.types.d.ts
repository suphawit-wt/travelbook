// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Review } from '@/features/property/lib/property.service.types';

export interface GuestReviewProps {
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface UserReviews {
  id: number;
  userName: string;
  country: string;
  details: string;
}
