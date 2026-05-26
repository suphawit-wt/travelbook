// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { enGB, enUS, th } from 'date-fns/locale';

import type { Language } from '@/shared/types/store';

const localeMap: Record<Language, Locale> = {
  en: enUS,
  gb: enGB,
  th,
};

export const getDateLocale = (language: Language): Locale => {
  return localeMap[language];
};
