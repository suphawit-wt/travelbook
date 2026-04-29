// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import i18next, { type InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
// import LocizeBackend from 'i18next-locize-backend'
import { initReactI18next } from 'react-i18next/initReactI18next';

import { i18nextInitOptions, languages } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// eslint-disable-next-line import/no-named-as-default-member -- this is for i18next
void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  // .use(runsOnServerSide ? LocizeBackend : resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`))) // locize backend could be used, but prefer to keep it in sync with server side
  .init({
    ...i18nextInitOptions,
    preload: runsOnServerSide ? languages : [],
  } as InitOptions);

i18next.services.formatter?.add('lowercase', (value: string) => {
  return value.toLowerCase();
});

// eslint-disable-next-line import/no-default-export -- this is for i18next
export default i18next;
