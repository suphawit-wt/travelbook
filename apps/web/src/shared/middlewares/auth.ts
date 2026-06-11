// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { NextResponse } from 'next/server';

import { USER_SESSION_COOKIE } from '@/shared/constants/app';

import { splitLangFromPath } from './i18n';

import type { MiddlewareHandler } from '../types/middleware';

const PROTECTED_PREFIXES = ['/myaccount'];
const AUTH_PREFIXES = ['/auth'];

const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export const withAuth: MiddlewareHandler = (req) => {
  const { pathname, search, origin } = req.nextUrl;
  const { lang, restPath } = splitLangFromPath(pathname);

  const normalizedPath = restPath === '/' || !restPath ? '/' : restPath;
  const isProtected = startsWithAny(normalizedPath, PROTECTED_PREFIXES);
  const isAuthRoute = startsWithAny(normalizedPath, AUTH_PREFIXES);
  const hasAuthSession = req.cookies.has(USER_SESSION_COOKIE);
  const targetLang = lang ?? 'en';

  if (isProtected && !hasAuthSession) {
    const nextParam = encodeURIComponent(pathname + search);
    return NextResponse.redirect(
      new URL(`/${targetLang}/auth/sign-in?next=${nextParam}`, origin),
    );
  }

  if (isAuthRoute && hasAuthSession) {
    return NextResponse.redirect(new URL(`/${targetLang}`, origin));
  }
};
