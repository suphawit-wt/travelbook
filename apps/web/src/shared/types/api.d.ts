// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { ApiStatus } from '@/shared/constants';

import type { HttpStatusCode } from 'axios';

interface ErrResponse {
  field: string;
  message: string;
}

interface PaginationResponse {
  page: number;
  perPage: number;
  totalCount: number;
  hasNext: boolean;
}

export interface ApiResponse {
  status: ApiStatus;
  statusCode: HttpStatusCode;
  message: string;
  errors?: ErrResponse[];
}

export interface ApiResponseWithData<T> {
  status: ApiStatus;
  statusCode: HttpStatusCode;
  message: string;
  data: T;
}

export interface ApiResponseWithDataPagination<T> {
  status: ApiStatus;
  statusCode: HttpStatusCode;
  message: string;
  data: T;
  pagination: PaginationResponse;
}
