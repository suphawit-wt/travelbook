// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Indicator, Root } from './progress.styled';

import type { ProgressProps } from './progress.types';
import type { FC } from 'react';

export const Progress: FC<ProgressProps> = ({
  color = 'blue',
  max = 100,
  ...props
}) => (
  <Root max={max} value={props.value}>
    <Indicator
      $color={color}
      $value={props.value}
      style={{ transform: `translateX(-${100 - props.value}%)` }}
    />
  </Root>
);
