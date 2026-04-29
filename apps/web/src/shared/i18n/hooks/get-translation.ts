// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use server';

import { headers } from 'next/headers';

import i18next from '../i18next';
import { i18nHeader } from '../settings';

import type { KeyPrefix, Namespace } from 'i18next';
import type { UseTranslationOptions } from 'react-i18next';

export async function getTranslation(
  ns?: Namespace,
  options?: UseTranslationOptions<KeyPrefix<Namespace>>,
) {
  const headerList = headers();
  const lng = headerList.get(i18nHeader);

  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng);
  }

  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns);
  }

  return {
    t: i18next.getFixedT(
      lng ?? i18next.resolvedLanguage ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- for i18next
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix as string | undefined,
    ),
    i18n: i18next,
  };
}
