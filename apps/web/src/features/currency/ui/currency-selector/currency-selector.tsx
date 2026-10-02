// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Dialog, IconButton, Skeleton, Text } from '@/shared/ui';

import { AllCurrencies } from './all-currencies/all-currencies';
import { ButtonWrapper, DialogContent } from './currency-selector.styled';

import type { CurrencySelectorProps } from './currency-selector.types';
import type { FC } from 'react';

export const CurrencySelector: FC<CurrencySelectorProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  const userCurrency = useAppSelector(selectCurrency);

  const { t } = useTranslation('common');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- for client render
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button $size="lg" $variant="ghost" aria-label="currency selector">
        <Skeleton height="1.6rem" width="2.4rem" />
      </Button>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {props.showTitle ? (
          <ButtonWrapper
            $variant="ghost"
            style={{ justifyContent: 'normal' }}
            tooltip={t('currency.tooltip', { ns: 'common' })}
          >
            <Text as="span">{userCurrency}</Text>
            <Text as="span">{t(`currency.dialog.items.${userCurrency}`)}</Text>
          </ButtonWrapper>
        ) : (
          <Button
            $pressEffect="scale"
            $variant="ghost"
            tooltip={t('currency.tooltip')}
          >
            {userCurrency}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <DialogContent>
          <Dialog.Title>{t('currency.dialog.title')}</Dialog.Title>
          <Dialog.Description>
            {t('currency.dialog.description')}
          </Dialog.Description>
          <AllCurrencies userCurrency={userCurrency} />
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
