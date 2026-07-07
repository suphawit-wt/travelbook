// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export interface NavbarInfoResponse {
  avatarUrl: string;
  geniusTier: number;
}

export interface Address {
  countryCode: string;
  addressLine1: string;
  city: string;
  zipCode: string;
}

export interface PassportDetails {
  firstName: string | null;
  lastName: string | null;
  passportNumber: string | null;
  issueCountry: string | null;
  expireDate: Date | null;
}

interface AddressResponse {
  countryCode: string | null;
  addressLine1: string | null;
  city: string | null;
  zipCode: string | null;
}

interface PersonalDetailsResponse {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  nationality: string | null;
}

export interface UserInfoResponse {
  firstName: string | null;
  lastName: string | null;
  email: string;
  displayName: string | null;
  personalDetails: PersonalDetailsResponse;
  phoneNumber: string | null;
  address: AddressResponse;
  passportDetails: PassportDetails;
  geniusTier: number;
  avatarUrl: string | null;
}

export interface AvatarResponse {
  avatarUrl: string;
}
