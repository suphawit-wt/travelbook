// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { APP } from '@/shared/constants/app';

import { LogoStyled } from './logo.styled';

import type { LogoProps } from './logo.types';
import type { FC } from 'react';

export const Logo: FC<LogoProps> = (props) => {
  return (
    <LogoStyled
      priority
      alt={APP.name}
      height="500"
      src="/assets/images/logo.svg"
      width="500"
      {...props}
    />
  );
};
