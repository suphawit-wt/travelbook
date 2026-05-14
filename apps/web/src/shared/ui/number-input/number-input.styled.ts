// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius, typography } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}
  border: 1px solid ${colors.separator};
  border-radius: ${radius.medium};
`;

export const Button = styled.button`
  /* Box model */
  width: 40px;
  height: 40px;
  border: none;

  /* Styling */
  background-color: transparent;
  color: ${colors.blue[400]};
  font-size: ${typography.fontSize.large};
  font-weight: ${typography.fontWeight.bold};
  cursor: pointer;
  user-select: none;
  border-radius: ${radius.medium};

  &:hover {
    background-color: ${colors.overlay.base};
  }

  &:disabled {
    background-color: transparent;
    color: ${colors.gray[700]};
    cursor: not-allowed;
  }
`;

export const NumberDisplay = styled.span`
  /* Layout */
  ${mixins.display.flex.flexContentCenter}

  /* Box model */
  width: 40px;
  height: 40px;

  /* Styling */
  background-color: ${colors.popover.base};
  font-size: ${typography.fontSize.small};
  user-select: none;
`;
