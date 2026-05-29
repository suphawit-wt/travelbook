// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { TrendingDestination } from '@/features/property/lib/property.service.types';
import type { Breakpoint } from '@/shared/types/components';

export interface TrendingDestinationWrapperProps {
  $showOnly?: Breakpoint;
}

export interface TrendingDestinationsProps {
  destinations: TrendingDestination[];
}
