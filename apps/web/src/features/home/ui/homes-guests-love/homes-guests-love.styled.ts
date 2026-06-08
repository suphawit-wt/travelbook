// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { Swiper } from '@/shared/ui';

import type { HomesGuestsLoveWrapperProps } from './homes-guests-love.types';

export const Wrapper = styled.section<HomesGuestsLoveWrapperProps>`
  /* Layout */
  ${mixins.display.showOnly}

  /* Box model */
  margin-top: 30px;
`;

export const Title = styled.div`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}

  margin-bottom: 16px;
`;

export const SwiperRoot = styled(Swiper.Root)`
  .swiper-wrapper {
    margin-bottom: 5px;
  }

  .swiper-wrapper > .swiper-slide {
    width: 23.7%;

    @media ${media.minDesktop4k} {
      width: 19.03%;
    }
  }
`;
