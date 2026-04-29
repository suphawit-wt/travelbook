// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { type NextRequest, type NextResponse } from 'next/server';

export type MiddlewareHandler = (
  req: NextRequest,
  res?: NextResponse,
) => Promise<NextResponse | undefined> | NextResponse | undefined;
