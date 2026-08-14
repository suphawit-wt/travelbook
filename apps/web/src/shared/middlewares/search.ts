// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { NextResponse } from 'next/server';

import { splitLangFromPath } from './i18n';

import type { MiddlewareHandler } from '../types/middleware';

export const withSearchDefaults: MiddlewareHandler = (req) => {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;
  const { restPath } = splitLangFromPath(pathname);

  // 1. Determine if the current route needs default booking parameters
  const isSearchPage = restPath === '/search';
  const isHotelDetailPage = restPath.startsWith('/hotels/');

  if (isSearchPage || isHotelDetailPage) {
    const hasCheckin = searchParams.has('checkin');
    const hasCheckout = searchParams.has('checkout');

    // 2. If dates are missing, trigger the fallback assignment
    if (!hasCheckin || !hasCheckout) {
      const redirectUrl = url.clone();

      // Calculate today (June 3, 2026) and 2 days from now
      const today = new Date();
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const formatDate = (d: Date) => d.toISOString().split('T')[0];

      if (!hasCheckin) {
        redirectUrl.searchParams.set('checkin', formatDate(today));
      }
      if (!hasCheckout) {
        redirectUrl.searchParams.set('checkout', formatDate(dayAfterTomorrow));
      }
      if (!searchParams.has('adult')) {
        redirectUrl.searchParams.set('adult', '2');
      }
      if (!searchParams.has('children')) {
        redirectUrl.searchParams.set('children', '0');
      }
      if (!searchParams.has('room')) redirectUrl.searchParams.set('room', '1');

      return NextResponse.redirect(redirectUrl);
    }
  }
};
