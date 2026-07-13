// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  AddressRequest,
  NameRequest,
  NavbarInfoResponse,
  UserInfoResponse,
} from './user.service.types';
import type { AxiosProgressEvent } from 'axios';

export interface UserServiceInterface {
  getNavbarInfo: () => Promise<NavbarInfoResponse>;
  getUserInfo: () => Promise<UserInfoResponse>;
  uploadAvatar: (
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  ) => Promise<string>;
  updateName: (req: NameRequest) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  sendNewEmailVerification: (email: string) => Promise<void>;
  updatePhoneNumber: (phoneNumber: string) => Promise<void>;
  updateDateOfBirth: (dateOfBirth: string) => Promise<void>;
  updateNationality: (nationality: string) => Promise<void>;
  updateGender: (gender: string) => Promise<void>;
  updateAddress: (req: AddressRequest) => Promise<void>;
}
