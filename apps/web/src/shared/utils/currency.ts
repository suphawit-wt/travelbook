// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Currency } from '@/shared/types/store';

interface CurrencyOption {
  symbol: Currency;
}

const currencyOptions: CurrencyOption[] = [
  { symbol: 'USD' },
  { symbol: 'THB' },
];

export const getCurrencyOptions = () => {
  return currencyOptions;
};
