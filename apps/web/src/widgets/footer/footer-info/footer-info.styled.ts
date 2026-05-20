// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, spacing } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  /* Box model */
  padding-bottom: 16px;

  /* Styling */
  background-color: ${colors.background.secondary};
`;

export const Control = styled.div`
  /* Layout */
  ${mixins.display.flex.flexContentCenter}
  gap: ${spacing.gap.medium};

  /* Box model */
  margin-bottom: 10px;

  @media ${media.minLaptop} {
    justify-content: normal;
  }
`;

export const Content = styled.div`
  /* Box model */
  padding: 12px 0;
`;

export const LogoGroup = styled.div`
  /* Layout */
  ${mixins.display.flex.flexContentCenter}
  flex-wrap: wrap;
  gap: ${spacing.gap.extraLarge};

  /* Box model */
  margin-top: 16px;

  @media ${media.maxLaptop} {
    display: none;
  }
`;
