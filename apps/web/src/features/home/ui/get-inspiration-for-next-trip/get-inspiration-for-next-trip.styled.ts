// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, radius, typography } from '@/shared/styles/variables';
import { Swiper } from '@/shared/ui';

import type { GetInspirationForNextTripWrapperProps } from './get-inspiration-for-next-trip.types';

export const Wrapper = styled.section<GetInspirationForNextTripWrapperProps>`
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
  .swiper-wrapper > .swiper-slide {
    max-width: 23.7%;

    @media ${media.minDesktop4k} {
      max-width: 18.3%;
    }
  }

  .swiper-wrapper > .swiper-slide:first-child {
    max-width: 49%;

    @media ${media.minDesktop4k} {
      max-width: 41.5%;
    }
  }

  .swiper-wrapper > .swiper-slide:first-child > a > div {
    & > div:first-child {
      height: 320px;
      max-height: 320px;
    }

    & > div:nth-child(2) {
      /* Layout */
      position: absolute;
      bottom: 0px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      /* Box model */
      padding: 35px 16px;
      height: 45%;
      border-radius: ${radius.medium};

      /* Styling */
      background: linear-gradient(0deg, hsla(0, 0%, 0%, 0.95) 0, transparent);

      & > span {
        color: ${colors.white};
        font-size: ${typography.fontSize.extraLarge};
      }

      & > p {
        color: ${colors.white};
        -webkit-text-fill-color: ${colors.white};
      }
    }
  }
`;
