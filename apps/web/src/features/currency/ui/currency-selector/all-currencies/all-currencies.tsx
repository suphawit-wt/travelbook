// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useCallback } from 'react';

import { setCurrency } from '@/features/user/store/user-preferences.slice';
import { useAppDispatch } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Currency } from '@/shared/types/store';
import { Heading, RadioCards } from '@/shared/ui';
import { getCurrencyOptions } from '@/shared/utils/currency';

import { CurrencyButton } from '../currency-button/currency-button';

import type { AllCurrenciesProps } from './all-currencies.types';
import type { FC } from 'react';

export const AllCurrencies: FC<AllCurrenciesProps> = (props) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const currencyOptions = getCurrencyOptions();

  const handleCurrencyChange = useCallback(
    (selectedCurrency: Currency) => {
      localStorage.setItem('currency', selectedCurrency);
      dispatch(setCurrency(selectedCurrency));
    },
    [dispatch],
  );

  return (
    <>
      <Heading $size="md" as="h4">
        {t('currency.dialog.all')}
      </Heading>
      <RadioCards.Root
        value={props.userCurrency}
        onValueChange={handleCurrencyChange}
      >
        {currencyOptions.map((currency) => (
          <CurrencyButton
            key={currency.symbol}
            label={t(`currency.dialog.items.${currency.symbol}`)}
            selected={props.userCurrency === currency.symbol}
            symbol={currency.symbol}
          />
        ))}
      </RadioCards.Root>
    </>
  );
};
