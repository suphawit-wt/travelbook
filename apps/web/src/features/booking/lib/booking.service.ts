// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import axios, { type AxiosInstance } from 'axios';

import { ApiStatus } from '@/shared/constants/api';
import {
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
} from '@/shared/errors/api-error';
import type { ApiResponse, ApiResponseWithData } from '@/shared/types/api';

import type { BookingServiceInterface } from './booking.service.interface';
import type {
  CreateBookingRequest,
  CreateBookingResponse,
  GetBookingByIdResponse,
  GetBookingConfirmationDetailsResponse,
  UpdateBookingDetailsRequest,
} from './booking.service.types';

const API_PREFIX = 'bookings';

export class BookingService implements BookingServiceInterface {
  constructor(private readonly axiosClient: AxiosInstance) {}

  async getBookingById(
    bookingId: string,
    currency: string,
  ): Promise<GetBookingByIdResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<GetBookingByIdResponse>
      >(`v1/${API_PREFIX}/${bookingId}`, {
        headers: {
          'X-Currency': currency,
        },
      });
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

  async getBookingConfirmationDetails(
    bookingId: string,
    currency: string,
  ): Promise<GetBookingConfirmationDetailsResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<GetBookingConfirmationDetailsResponse>
      >(`v1/${API_PREFIX}/${bookingId}/confirmation`, {
        headers: {
          'X-Currency': currency,
        },
      });
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

  async createBooking(
    req: CreateBookingRequest,
    currency: string,
  ): Promise<CreateBookingResponse> {
    try {
      const response = await this.axiosClient.post<
        ApiResponseWithData<CreateBookingResponse>
      >(
        `v1/${API_PREFIX}`,
        { ...req },
        {
          headers: {
            'X-Currency': currency,
          },
        },
      );
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

  async updateBookingDetails(
    bookingId: string,
    req: UpdateBookingDetailsRequest,
  ): Promise<void> {
    try {
      await this.axiosClient.patch<ApiResponse>(
        `v1/${API_PREFIX}/${bookingId}/details`,
        { ...req },
      );
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
