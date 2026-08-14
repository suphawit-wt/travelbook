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
import type {
  ApiResponse,
  ApiResponseWithData,
  ApiResponseWithDataPagination,
} from '@/shared/types/api';

import type {
  EasyTripPlanner,
  PropertyItem,
  PropertyItemWithRoom,
  PropertyType,
  PropertyWithDetail,
  TrendingDestination,
  TripArticle,
} from './property.service.types';

import type { PropertyServiceInterface } from './property.service.interface';

const API_PREFIX = 'properties';

export class PropertyService implements PropertyServiceInterface {
  constructor(private readonly axiosClient: AxiosInstance) {}

  async getPropertyTypes(): Promise<PropertyType[]> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<PropertyType[]>
      >(`v1/${API_PREFIX}/property-type`);
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

  async getTrendingDestinations(): Promise<TrendingDestination[]> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<TrendingDestination[]>
      >(`v1/${API_PREFIX}/trending-destinations`);
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

  async getEasyTripPlans(): Promise<EasyTripPlanner> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<EasyTripPlanner>
      >(`v1/${API_PREFIX}/easy-trip-plans`);
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

  async getInspirationArticles(): Promise<TripArticle[]> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<TripArticle[]>
      >(`v1/${API_PREFIX}/trip-articles`);
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

  async getHomesGuestsLove(): Promise<PropertyItem[]> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<PropertyItem[]>
      >(`v1/${API_PREFIX}/homes-guests-love`);
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

  async searchProperties(
    dest: string,
    checkin: string,
    checkout: string,
    adults: number,
    children: number,
    room: number,
    page: number,
    perPage: number,
    currency: string,
  ): Promise<ApiResponseWithDataPagination<PropertyItemWithRoom[]>> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithDataPagination<PropertyItemWithRoom[]>
      >(`v1/${API_PREFIX}/search`, {
        params: {
          dest,
          checkin,
          checkout,
          adults,
          children,
          room,
          page,
          per_page: perPage,
        },
        headers: {
          'X-Currency': currency,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, message } = error.response.data as ApiResponse;

        switch (status) {
          case ApiStatus.NotFound:
            throw new NotFoundError(message);
          default:
            throw new UnexpectedError();
        }
      }

      throw new UnexpectedError();
    }
  }

  async getPropertyBySlugWithAvailability(
    slug: string,
    checkin: string,
    checkout: string,
    adults: number,
    children: number,
    room: number,
    currency: string,
  ): Promise<PropertyWithDetail> {
    try {
      const response = await this.axiosClient.get<
        ApiResponseWithData<PropertyWithDetail>
      >(`v1/${API_PREFIX}/by-slug/${slug}`, {
        params: {
          checkin,
          checkout,
          adults,
          children,
          room,
        },
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
}
