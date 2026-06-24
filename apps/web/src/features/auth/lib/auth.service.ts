// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import axios from 'axios';

import { ApiStatus, env } from '@/shared/constants';
import {
  BadRequestError,
  ExpiredOTPError,
  UnauthorizedError,
  UnexpectedError,
  ValidationError,
} from '@/shared/errors/api-error';
import type { ApiResponse, ApiResponseWithData } from '@/shared/types/api';

import type { AuthServiceInterface } from './auth.service.interface';
import type { TokenResponse } from './auth.service.types';

const API_PREFIX = 'auth';

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

export class AuthService implements AuthServiceInterface {
  async userSignIn(email: string): Promise<void> {
    try {
      await apiClient.post<ApiResponse>(`v1/${API_PREFIX}/user/sign-in`, {
        email,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message, errors } = error.response.data as ApiResponse;

        if (status === ApiStatus.InvalidInput && errors) {
          throw new ValidationError(message, errors);
        }

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async userVerifyEmail(email: string, otp: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponseWithData<TokenResponse>>(
        `v1/${API_PREFIX}/user/verify-email`,
        { email, otp },
        { withCredentials: true },
      );
      return response.data.data.accessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message, errors } = error.response.data as ApiResponse;

        if (status === ApiStatus.InvalidInput && errors) {
          throw new ValidationError(message, errors);
        }

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          case ApiStatus.ExpiredOTP:
            throw new ExpiredOTPError(message);
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async userRefreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponseWithData<TokenResponse>>(
        `v1/${API_PREFIX}/user/refresh`,
        {},
        { withCredentials: true },
      );
      return response.data.data.accessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message } = error.response.data as ApiResponse;

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async userSignOut(): Promise<void> {
    try {
      await apiClient.post<ApiResponse>(
        `v1/${API_PREFIX}/user/sign-out`,
        {},
        { withCredentials: true },
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message } = error.response.data as ApiResponse;

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async userGoogleSignIn(authCode: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponseWithData<TokenResponse>>(
        `v1/${API_PREFIX}/user/google`,
        { authCode },
        { withCredentials: true },
      );
      return response.data.data.accessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message, errors } = error.response.data as ApiResponse;

        if (status === ApiStatus.InvalidInput && errors) {
          throw new ValidationError(message, errors);
        }

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          case ApiStatus.ExpiredOTP:
            throw new ExpiredOTPError(message);
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async userFacebookSignIn(accessToken: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponseWithData<TokenResponse>>(
        `v1/${API_PREFIX}/user/facebook`,
        { accessToken },
        { withCredentials: true },
      );
      return response.data.data.accessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message, errors } = error.response.data as ApiResponse;

        if (status === ApiStatus.InvalidInput && errors) {
          throw new ValidationError(message, errors);
        }

        switch (status) {
          case ApiStatus.BadRequest:
            throw new BadRequestError(message);
          case ApiStatus.ExpiredOTP:
            throw new ExpiredOTPError(message);
          case ApiStatus.Unauthorized:
            throw new UnauthorizedError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }
}
