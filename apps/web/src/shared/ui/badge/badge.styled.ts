// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors } from '@/shared/styles/variables';

import type { BadgeProps } from './badge.types';

export const Badge = styled.span<BadgeProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Box model */
  border: 1px solid transparent;
  border-radius: 4px;

  /* Styling */
  color: ${colors.white};
  text-align: center;

  /* Animation */

  ${mixins.badge.badgeColor}
  ${mixins.badge.badgeSize}
`;
