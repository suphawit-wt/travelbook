// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Room } from '@/features/property/lib/property.service.types';

import type { LucideIcon } from 'lucide-react';

export interface FacilityInfoItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface AmenityItem {
  id: string;
  label: string;
}

export interface AvailabilitySectionProps {
  propertyId: string;
  rooms: Room[];
  searchQuery: SearchQuery;
  nights: number;
}

interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  adult: number;
  children: number;
  room: number;
}
