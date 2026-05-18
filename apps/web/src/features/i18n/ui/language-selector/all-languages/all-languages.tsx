// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Heading, RadioCards } from '@/shared/ui';
import { getLanguageOptions } from '@/shared/utils/i18n';

import { LanguageButton } from '../language-button/language-button';

export const AllLanguages = () => {
  const { t, i18n } = useTranslation('common');

  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const languageOptions = getLanguageOptions();

  return (
    <>
      <Heading $size="md" as="h4">
        {t('language.dialog.all')}
      </Heading>
      <RadioCards.Root value={currentLanguage}>
        {languageOptions.map((language) => (
          <LanguageButton
            key={language.code}
            label={language.label}
            selected={currentLanguage === language.code}
            symbol={language.code}
          />
        ))}
      </RadioCards.Root>
    </>
  );
};
