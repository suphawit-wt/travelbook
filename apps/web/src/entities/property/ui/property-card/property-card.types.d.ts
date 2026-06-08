// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyRoom } from '@/features/property/lib/property.service.types';
import type { CountryCode } from '@/shared/types/country';

type PropertyCardVariants = 'landscape' | 'portrait' | 'search-portrait';

export interface PropertyCardProps {
  slug: string;
  name: string;
  area: string;
  city: string;
  countryCode: CountryCode;
  avgRating: number;
  reviewCount: number;
  startingPrice: number;
  image: string;
  room: PropertyRoom;
  nights: number;
  adults: number;
  childrens: number;
  queryString?: string;
  variants: PropertyCardVariants;
}
