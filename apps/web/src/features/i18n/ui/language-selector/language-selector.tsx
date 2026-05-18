// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { X } from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Dialog, IconButton, Image, Text } from '@/shared/ui';
import { getLanguageMetadata } from '@/shared/utils/i18n';

import { AllLanguages } from './all-languages/all-languages';
import { DialogContent, LangButton } from './language-selector.styled';

import type { LanguageSelectorProps } from './language-selector.types';
import type { FC } from 'react';

export const LanguageSelector: FC<LanguageSelectorProps> = (props) => {
  const { t, i18n } = useTranslation('common');

  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const { flag, title } = getLanguageMetadata(currentLanguage);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {props.showTitle ? (
          <LangButton style={{ justifyContent: 'normal' }}>
            <Image
              $shape="circle"
              alt="Country flag"
              height="24"
              src={flag}
              width="24"
            />
            <Text as="span">{title}</Text>
          </LangButton>
        ) : (
          <Button
            $pressEffect="scale"
            $variant="ghost"
            tooltip={t('language.tooltip')}
          >
            <Image
              $shape="circle"
              alt="Country flag"
              height="24"
              src={flag}
              width="24"
            />
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <DialogContent>
          <Dialog.Title>{t('language.dialog.title')}</Dialog.Title>
          <Dialog.Description style={{ display: 'none' }}>
            &nbsp;
          </Dialog.Description>
          <AllLanguages />
          <Dialog.Close asChild>
            <IconButton
              $size="sm"
              $variant="ghost"
              icon={X}
              style={{ position: 'absolute', top: '15px', right: '15px' }}
            />
          </Dialog.Close>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
