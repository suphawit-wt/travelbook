// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { ApiResponseWithData } from '@/shared/types/api';
import type {
  EasyTripPlanner,
  PropertyItem,
  PropertyItemWithRoom,
  PropertyType,
  TrendingDestination,
  TripArticle,
} from './property.service.types';

export interface PropertyServiceInterface {
  getPropertyTypes: () => Promise<PropertyType[]>;
  getTrendingDestinations: () => Promise<TrendingDestination[]>;
  getEasyTripPlans: () => Promise<EasyTripPlanner>;
  getInspirationArticles: () => Promise<TripArticle[]>;
  getHomesGuestsLove: () => Promise<PropertyItem[]>;
  searchProperties: (
    dest: string,
    checkin: string,
    checkout: string,
    adults: number,
    children: number,
    room: number,
    page: number,
    perPage: number,
    currency: string,
  ) => Promise<ApiResponseWithData<PropertyItemWithRoom[]>>;
}
