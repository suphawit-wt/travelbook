// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { spacing } from '@/shared/styles/variables';

export const CurrencyDisplay = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: ${spacing.gap.small};
`;
