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

import type { PaymentServiceInterface } from './payment.service.interface';
import type { CreateBookingPaymentsResponse } from './payment.service.types';

const API_PREFIX = 'payments';

export class PaymentService implements PaymentServiceInterface {
  constructor(private readonly axiosClient: AxiosInstance) {}

  async createBookingPayments(
    bookingId: string,
  ): Promise<CreateBookingPaymentsResponse> {
    try {
      const response = await this.axiosClient.post<
        ApiResponseWithData<CreateBookingPaymentsResponse>
      >(`v1/${API_PREFIX}/intents`, { bookingId });
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
