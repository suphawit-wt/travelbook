// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export interface SearchCheckInOverviewProps {
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
