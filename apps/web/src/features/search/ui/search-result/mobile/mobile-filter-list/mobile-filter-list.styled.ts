// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { spacing } from '@/shared/styles/variables';

export const List = styled.ul`
  display: flex;
  gap: ${spacing.gap.extraSmall};
  overflow-x: auto;
  padding-inline: 16px;

  & > li {
    flex-shrink: 0;
  }

  @media ${media.minLaptop} {
    display: none;
  }
`;
