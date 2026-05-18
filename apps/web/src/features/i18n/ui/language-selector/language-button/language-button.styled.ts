// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextLink from 'next/link';
import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';

export const LanguageDisplay = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenterWithGap}
`;

export const LanguageLink = styled(NextLink)`
  text-decoration: none;

  @media ${media.maxLaptop} {
    width: 100%;
  }
`;
