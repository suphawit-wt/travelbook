// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

export const PopoverButton = styled.button`
  /* Layout */
  display: flex;

  /* Box model */
  padding: 4px 12px;
  height: 100%;
  min-height: 50px;
  border: 1px solid transparent;

  /* Styling */
  background-color: ${colors.background.base};
  user-select: none;
  border-radius: ${radius.small};
  -webkit-text-fill-color: ${colors.text.base} !important;

  & > div:first-child {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  & > div > div {
    -webkit-text-fill-color: ${colors.text.base} !important;
  }
`;
