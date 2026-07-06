// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import axios, { type AxiosInstance } from 'axios';

import { ApiStatus } from '@/shared/constants';
import {
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
} from '@/shared/errors/api-error';
import type { ApiResponse, ApiResponseWithData } from '@/shared/types/api';

import type { UserServiceInterface } from './user.service.interface';
import type { NavbarInfoResponse } from './user.service.types';

const API_PREFIX = 'users';

export class UserService implements UserServiceInterface {
  constructor(private readonly axiosClient: AxiosInstance) {}

  async getNavbarInfo(): Promise<NavbarInfoResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<NavbarInfoResponse>
      >(`v1/${API_PREFIX}/navbar-info`);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message } = error.response.data as ApiResponse;

        switch (status) {
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          case ApiStatus.NotFound:
            throw new NotFoundError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }
}
