// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Root, Thumb } from './switch.styled';

import type { SwitchProps } from './switch.types';
import type { FC } from 'react';

export const Switch: FC<SwitchProps> = ({ $size = 'md', ...props }) => {
  return (
    <div>
      <Root $size={$size} {...props}>
        <Thumb />
      </Root>
    </div>
  );
};
