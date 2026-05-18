// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

interface LanguageMetadata {
  flag: string;
  title: string;
}

interface LanguageOption {
  code: string;
  label: string;
}

const LANGUAGE_CONFIG = {
  en: { flag: '/assets/images/flags/us.png', title: 'English (US)' },
  gb: { flag: '/assets/images/flags/gb.png', title: 'English (UK)' },
  th: { flag: '/assets/images/flags/th.png', title: 'ภาษาไทย' },
} satisfies Record<string, LanguageMetadata>;

const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English (US)' },
  { code: 'gb', label: 'English (UK)' },
  { code: 'th', label: 'ภาษาไทย' },
];

export const getLanguageMetadata = (lang: string): LanguageMetadata => {
  const config = LANGUAGE_CONFIG as Record<
    string,
    LanguageMetadata | undefined
  >;
  const result = config[lang];

  return result ?? LANGUAGE_CONFIG.en;
};

export const getLanguageOptions = () => {
  return languageOptions;
};
