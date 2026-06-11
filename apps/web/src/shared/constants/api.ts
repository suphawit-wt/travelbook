// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export enum ApiStatus {
  Success = 'SUCCESS',
  InvalidInput = 'INVALID_INPUT',
  BadRequest = 'BAD_REQUEST',
  Unauthorized = 'UNAUTHORIZED',
  TokenNotMatched = 'TOKEN_NOT_MATCHED',
  ExpiredOTP = 'EXPIRED_OTP',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  Conflict = 'CONFLICT',
  Unexpected = 'UNEXPECTED',
}
