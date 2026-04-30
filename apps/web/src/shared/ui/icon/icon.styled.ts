// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { StyledIconProps } from './icon.types';

export const Wrapper = styled.div<StyledIconProps>`
  display: inline-flex;

  /* Styling */
  ${mixins.icon.iconColor}
  ${mixins.icon.iconSize}
`;
