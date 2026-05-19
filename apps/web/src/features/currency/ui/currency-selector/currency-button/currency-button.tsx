// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Check } from 'lucide-react';

import { Icon, RadioCards, Text } from '@/shared/ui';

import { CurrencyDisplay } from './currency-button.styled';

import type { CurrencyButtonProps } from './currency-button.types';
import type { FC } from 'react';

export const CurrencyButton: FC<CurrencyButtonProps> = (props) => {
  return (
    <RadioCards.Item disabled={props.selected} value={props.symbol}>
      <CurrencyDisplay>
        <Text $size="sm" as="span">
          {props.label}
        </Text>
        <Text $size="sm" as="span" color="description">
          {props.symbol}
        </Text>
      </CurrencyDisplay>
      {props.selected ? (
        <div>
          <Icon icon={Check} />
        </div>
      ) : null}
    </RadioCards.Item>
  );
};
