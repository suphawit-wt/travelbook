// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius, spacing } from '@/shared/styles/variables';

export const ProfileMenu = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenterWithGap}
  user-select: none;
`;

export const ProfileAvatar = styled.div`
  /* Layout */
  display: flex;
  user-select: none;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border: 2px solid ${colors.yellow[500]};
  border-radius: ${radius.full};
`;

export const ProfileInfo = styled.div`
  /* Layout */
  ${mixins.display.flex.flexColumnFlexStart}
  gap: ${spacing.gap.extraSmall};
  user-select: none;
`;
