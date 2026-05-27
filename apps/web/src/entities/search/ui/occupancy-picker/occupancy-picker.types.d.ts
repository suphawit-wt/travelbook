// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export interface OccupancyPickerProps {
  value: OccupancyValue;
  onChange: (value: OccupancyValue) => void;
  maxAdults?: number;
  maxRooms?: number;
  showApartmentOption?: boolean;
  showPetOption?: boolean;
  disabled?: boolean;
}

export interface OccupancyValue {
  adult: number;
  children: number;
  room: number;
  lookingForApartment?: boolean;
  withPets?: boolean;
}
