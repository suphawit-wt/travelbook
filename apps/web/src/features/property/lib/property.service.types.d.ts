// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

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
