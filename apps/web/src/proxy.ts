// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { NextResponse } from 'next/server';

import { withAuth, withI18n, withSearchDefaults } from '@/shared/middlewares';

import type { NextRequest } from 'next/server';

const middlewares = [withI18n, withSearchDefaults, withAuth];

/**
 * Orchestrates the application's middleware pipeline by running sequential,
 * modular middleware handlers (e.g., i18n localization, query parameter injection, auth guards).
 *
 * @remarks
 * Each handler can short-circuit the pipeline by issuing a terminal redirect (307/308)
 * or pass downstream modifications (like cookies or headers) down the execution chain.
 *
 * @param req - The incoming Next.js request object.
 * @returns A redirect response to abort execution, or the modified response to proceed.
 */
export async function proxy(req: NextRequest): Promise<NextResponse> {
  let response: NextResponse | undefined;

  for (const handler of middlewares) {
    const result = await handler(req, response);

    if (result instanceof NextResponse) {
      // If a handler issued a explicit Redirect/Response command, return it immediately
      if (result.status === 307 || result.status === 308) {
        return result;
      }
      // Otherwise, pass mutated response (like appended cookies/headers) down the pipe
      response = result;
    }
  }

  return response ?? NextResponse.next();
}

/**
 * Global matcher configuration for the Next.js middleware pipeline.
 *
 * @remarks
 * Excludes static files, assets, service workers, manifest endpoints, and internal Next.js API routes
 * to minimize processing overhead across non-page routes.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};
