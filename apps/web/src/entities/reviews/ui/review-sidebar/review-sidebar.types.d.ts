// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Review } from '@/features/property/lib/property.service.types';

export interface ReviewSidebarProps {
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
}
