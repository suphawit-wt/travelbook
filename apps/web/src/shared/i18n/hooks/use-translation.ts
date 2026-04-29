// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

/* eslint-disable react-hooks/rules-of-hooks -- for i18next */

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation as useI18nTranslation } from 'react-i18next';

import i18next from '../i18next';
import { i18nCookie } from '../settings';

import type { KeyPrefix, Namespace } from 'i18next';
import type { UseTranslationOptions } from 'react-i18next';

const runsOnServerSide = typeof window === 'undefined';

export function useTranslation(
  ns?: Namespace,
  options?: UseTranslationOptions<KeyPrefix<Namespace>>,
) {
  const { lng } = useParams<{ lng: string }>();

  if (typeof lng !== 'string') {
    throw new Error('useT is only available inside /app/[lng]');
  }

  if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng).catch((err: unknown) => {
      // eslint-disable-next-line no-console -- Console is used here for debugging purposes in development
      console.error('Failed to change language:', err);
    });
  } else {
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

    useEffect(() => {
      if (activeLng === i18next.resolvedLanguage) return;
      setActiveLng(i18next.resolvedLanguage);
    }, [activeLng]);

    useEffect(() => {
      if (!lng || i18next.resolvedLanguage === lng) return;
      i18next.changeLanguage(lng).catch((err: unknown) => {
        // eslint-disable-next-line no-console -- Console is used here for debugging purposes in development
        console.error('Failed to change language:', err);
      });
    }, [lng]);

    // Sync cookie with current language
    const [cookies, setCookie] = useCookies([i18nCookie]);

    useEffect(() => {
      if (cookies.i18next === lng) return;
      setCookie(i18nCookie, lng, { path: '/' });
    }, [lng, cookies.i18next, setCookie]);
  }

  return useI18nTranslation(ns, options);
}
