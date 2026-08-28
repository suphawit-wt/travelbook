// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, typography } from '@/shared/styles/variables';
import { Card } from '@/shared/ui';

export const Wrapper = styled(Card.Root)`
  @media ${media.maxLaptop} {
    margin: 8px 0;
    background-color: ${colors.background.base};
    border-radius: 0px;

    & > div > div:first-child > h3 {
      font-size: ${typography.fontSize.medium};
    }
  }
`;

export const ImageWrapper = styled.div`
  @media ${media.maxLaptop} {
    & > img {
      width: 80px;
      height: auto;
    }
  }
`;
