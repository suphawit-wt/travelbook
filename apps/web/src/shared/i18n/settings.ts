// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { InitOptions } from 'i18next';

export const fallbackLng = 'en';
export const languages = [fallbackLng, 'th'];
export const defaultNS = 'common';
export const i18nCookie = 'i18next';
export const i18nHeader = 'x-i18next-current-language';

export const i18nextInitOptions: InitOptions = {
  // debug: true,
  supportedLngs: languages,
  fallbackLng,
  fallbackNS: defaultNS,
  defaultNS,
  detection: {
    order: ['cookie', 'navigator', 'path', 'htmlTag'],
  },
};
