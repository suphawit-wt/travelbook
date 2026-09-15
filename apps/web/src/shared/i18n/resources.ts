// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import account from './locales/en/account.json';
import auth from './locales/en/auth.json';
import booking from './locales/en/booking.json';
import common from './locales/en/common.json';
import country from './locales/en/country.json';
import facilities from './locales/en/facilities.json';
import home from './locales/en/home.json';
import property from './locales/en/property.json';
import reviews from './locales/en/reviews.json';
import search from './locales/en/search.json';

export const resources = {
  en: {
    account,
    auth,
    booking,
    common,
    country,
    facilities,
    home,
    search,
    property,
    reviews,
  },
} as const;
