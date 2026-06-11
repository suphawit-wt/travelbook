// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { HttpStatusCode } from 'axios';

import { ApiStatus } from '@/shared/constants';
import type { ErrResponse } from '@/shared/types/api';

export class ApiError extends Error {
  constructor(
    public override message: string,
    public status: ApiStatus,
    public statusCode: HttpStatusCode,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.BadRequest, HttpStatusCode.BadRequest);
  }
}

export class ValidationError extends ApiError {
  constructor(
    public override message: string,
    public errors: ErrResponse[],
  ) {
    super(message, ApiStatus.InvalidInput, HttpStatusCode.BadRequest);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.Unauthorized, HttpStatusCode.Unauthorized);
  }
}

export class ExpiredOTPError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.ExpiredOTP, HttpStatusCode.Unauthorized);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.Forbidden, HttpStatusCode.Forbidden);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.NotFound, HttpStatusCode.NotFound);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, ApiStatus.Conflict, HttpStatusCode.Conflict);
  }
}

export class UnexpectedError extends ApiError {
  constructor() {
    super(
      'Unexpected error occurred.',
      ApiStatus.Unexpected,
      HttpStatusCode.InternalServerError,
    );
  }
}
