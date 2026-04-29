// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';

import {
  fallbackLng,
  i18nCookie,
  i18nHeader,
  languages,
} from '@/shared/i18n/settings';

import type { MiddlewareHandler } from '../types/middleware';

acceptLanguage.languages(languages);

export function splitLangFromPath(pathname: string) {
  const segs = pathname.split('/').filter(Boolean);
  const first = segs[0];

  if (first && languages.includes(first)) {
    return { lang: first, restPath: `/${segs.slice(1).join('/')}` };
  }
  return { lang: null, restPath: pathname };
}

export const withI18n: MiddlewareHandler = (req) => {
  const { pathname, search, origin } = req.nextUrl;

  if (
    pathname.includes('icon') ||
    pathname.includes('chrome') ||
    pathname.startsWith('/_next')
  ) {
    return;
  }

  let lang: string | null = null;
  if (req.cookies.has(i18nCookie)) {
    lang = acceptLanguage.get(req.cookies.get(i18nCookie)?.value);
  }
  if (!lang) {
    lang =
      acceptLanguage.get(req.headers.get('Accept-Language')) ?? fallbackLng;
  }

  const { lang: langInPath } = splitLangFromPath(pathname);

  // Missing locale prefix? Redirect immediately
  if (!langInPath) {
    return NextResponse.redirect(
      new URL(`/${lang}${pathname}${search}`, req.url),
    );
  }

  // Forward the resolved language headers downstream
  const headers = new Headers(req.headers);
  headers.set(i18nHeader, langInPath);

  const response = NextResponse.next({ request: { headers } });

  // Sync language cookie configuration from Referer
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') ?? '', origin);
    const { lang: refLang } = splitLangFromPath(refererUrl.pathname);
    if (refLang) {
      response.cookies.set(i18nCookie, refLang);
    }
  }

  return response;
};
