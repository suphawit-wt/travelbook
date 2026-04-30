// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors } from '@/shared/styles/variables';

import type { SeparatorProps } from './separator.types';

export const Separator = styled.hr<SeparatorProps>`
  height: 1px;
  width: initial;
  background-color: ${colors.separator};

  ${mixins.display.showOnly}
`;
