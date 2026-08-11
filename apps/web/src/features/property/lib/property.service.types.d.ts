// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { CountryCode } from '@/shared/types/country';

export interface PropertyType {
  id: string;
  title: Type;
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

export interface PropertyWithDetail {
  id: string;
  name: string;
  slug: string;
  type: Type;

  checkInFrom: string;
  checkInUntil: string;
  checkOutFrom: string;
  checkOutUntil: string;

  countryCode: string;
  city: string;
  area: string;
  zipCode: string;

  avgRating: number;
  reviewCount: number;

  about: string;
  highlights: Highlights;
  areaInfo: AreaInfo;

  rules: PropertyRules;
  finePrint: string;

  reviews: Review[];
  images: Image[];
  facilities: FacilityCategory[];

  rooms: Room[];
}

export interface PropertyRules {
  checkIn: TimeRange;
  checkOut: TimeRange;

  damageDeposit: {
    required: boolean;
    price: number | null;
  };

  childPolicies: {
    allowed: boolean;
    minAgeAllowed: number | null;
    chargedAsAdultsAge: number | null;
  };

  cribAndExtraBedPolicies: {
    crib: BedPolicy;
    extraBed: BedPolicy;
  };

  minCheckinAge: number;
  petsAllowed: boolean;
  partiesAllowed: boolean;

  acceptedPayment: PaymentMethod[];
}

export interface Room {
  roomId: string;
  name: string;
  bedInfo: string;

  facilities: string[] | null;

  ratePlans: RatePlan[];
  availableRooms: number;
}

type Type = 'hotel' | 'apartment' | 'villa' | 'resort' | 'hostel';

type PaymentMethod = 'cash' | 'visa' | 'mastercard' | 'promtpay';

interface Bed {
  type: string;
  quantity: number;
}

interface Highlights {
  roomsWith: string[];
  breakfastInfo: string | null;
}

interface AreaInfo {
  nearbyPlaces: AreaItem[] | null;
  restaurantsCafe: AreaItem[] | null;
  topAttractions: AreaItem[] | null;
  naturalBeauty: AreaItem[] | null;
  beaches: AreaItem[] | null;
  publicTransit: AreaItem[] | null;
  closestAirports: AreaItem[] | null;
}

interface AreaItem {
  name: string;
  type: 'cafeBar';
  distanceM: number;
}

interface TimeRange {
  from: string;
  until: string;
}

interface BedPolicy {
  ageRange: {
    min: number | null;
    max: number | null;
  };
  free: boolean;
  price: number | null;
}

interface Review {
  id: string;
  displayName: string;
  countryCode: string;
  comment: string;
}

interface Image {
  id: string;
  url: string;
  position: number;
  orientation: 'landscape' | 'portrait';
}

interface FacilityCategory {
  category: string;
  items: string[];
}

interface RatePlan {
  id: string;
  name: string;

  maxGuest: number;
  price: number;

  refundable: boolean;
  breakfastIncluded: boolean;
}
