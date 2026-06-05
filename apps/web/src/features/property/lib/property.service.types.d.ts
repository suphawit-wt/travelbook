// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { CountryCode } from '@/shared/types/country';

export interface PropertyType {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface TrendingDestination {
  id: string;
  name: string;
  image: string;
  country: string;
}

export interface DestinationTrip {
  id: string;
  name: string;
  distance: number;
  image: string;
  link: string;
}

export interface EasyTripPlanner {
  beachList: DestinationTrip[];
  romanceList: DestinationTrip[];
  outdoorsList: DestinationTrip[];
  cityList: DestinationTrip[];
  relaxList: DestinationTrip[];
}

export interface TripArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface Bed {
  type: string;
  quantity: number;
}

export interface PropertyRoom {
  name: string;
  beds: Bed[];
  breakfastIncluded: boolean;
}

export interface PropertyItem {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  countryCode: CountryCode;
  avgRating: number;
  reviewCount: number;
  startingPrice: number;
  image: string;
}

export interface PropertyItemWithRoom extends PropertyItem {
  room: PropertyRoom;
}
