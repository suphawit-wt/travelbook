// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { format, parseISO } from 'date-fns';
import { enGB, enUS, th } from 'date-fns/locale';

import type { Language } from '@/shared/types/store';

const localeMap: Record<Language, Locale> = {
  en: enUS,
  gb: enGB,
  th,
};

const dateShortFormatMap: Record<Language, string> = {
  en: 'MMM d',
  gb: 'MMM d',
  th: 'd MMM',
};

const dateFullFormatMap: Record<Language, string> = {
  en: 'MMMM d, yyyy',
  gb: 'MMMM d, yyyy',
  th: 'd MMMM yyyy',
};

const dateFullWithWeekdayFormatMap: Record<Language, string> = {
  en: 'EEE, MMM d, yyyy',
  gb: 'EEE, MMM d, yyyy',
  th: 'EEEE d MMM yyyy',
};

const dateNumericFormatMap: Record<Language, string> = {
  en: 'yyyy/MM/dd',
  gb: 'yyyy/MM/dd',
  th: 'yyyy/MM/dd',
};

export const getDateLocale = (language: Language): Locale => {
  return localeMap[language];
};

export const formatLocalizedDate = (
  date: Date,
  language: Language,
  type: 'short' | 'full' | 'fullWithWeekday' | 'numeric',
): string => {
  if (type === 'short') {
    return format(date, dateShortFormatMap[language], {
      locale: localeMap[language],
    });
  } else if (type === 'full') {
    return format(date, dateFullFormatMap[language], {
      locale: localeMap[language],
    });
  } else if (type === 'numeric') {
    return format(date, dateNumericFormatMap[language], {
      locale: localeMap[language],
    });
  }
  return format(date, dateFullWithWeekdayFormatMap[language], {
    locale: localeMap[language],
  });
};

export const formatLocalizedDateString = (
  dateString: string,
  language: Language,
  type: 'short' | 'full' | 'fullWithWeekday' | 'numeric',
): string => {
  const date = parseISO(dateString);

  if (type === 'short') {
    return format(date, dateShortFormatMap[language], {
      locale: localeMap[language],
    });
  } else if (type === 'full') {
    return format(date, dateFullFormatMap[language], {
      locale: localeMap[language],
    });
  } else if (type === 'numeric') {
    return format(date, dateNumericFormatMap[language], {
      locale: localeMap[language],
    });
  }
  return format(date, dateFullWithWeekdayFormatMap[language], {
    locale: localeMap[language],
  });
};
