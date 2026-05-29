// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, spacing } from '@/shared/styles/variables';

import type { TrendingDestinationWrapperProps } from './trending-destinations.types';

export const Wrapper = styled.section<TrendingDestinationWrapperProps>`
  /* Layout */
  ${mixins.display.showOnly}

  /* Box model */
  margin-top: 30px;
`;

export const ContentFirstRow = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.gap.large};

  /* Box model */
  margin-top: 16px;

  & a > div {
    height: 270px;

    &:hover {
      border: 1px solid ${colors.yellow[500]};
    }

    @media ${media.minDesktop4k} {
      height: 320px;
    }
  }
`;

export const ContentSecondRow = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.gap.large};

  /* Box model */
  margin-top: 16px;

  & a > div {
    height: 270px;

    &:hover {
      border: 1px solid ${colors.yellow[500]};
    }

    @media ${media.minDesktop4k} {
      height: 320px;
    }
  }
`;
