// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { spacing } from '@/shared/styles/variables';
import { Card } from '@/shared/ui';

export const Content = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.gap.large};

  /* Box model */
  margin-top: 12px;

  @media ${media.minLaptop} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CardContent = styled(Card.Content)`
  display: flex;
  justify-content: space-between;

  @media ${media.minTablet} {
    align-items: center;
  }
`;

export const ImageRightWrapper = styled.div`
  & > img {
    width: 64px;
    height: 32px;

    @media ${media.minTablet} {
      width: 120px;
      height: 60px;
    }
  }
`;
