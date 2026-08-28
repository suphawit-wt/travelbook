// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';
import { Swiper } from '@/shared/ui';

export const Wrapper = styled.section`
  margin-bottom: 8px;
  padding: 16px;
  background-color: ${colors.background.base};
`;

export const SwiperRoot = styled(Swiper.Root)`
  .swiper-wrapper {
    margin-bottom: 5px;
  }

  .swiper-wrapper > .swiper-slide {
    width: 75%;

    @media ${media.minTablet} {
      width: 45%;
    }
  }
`;
