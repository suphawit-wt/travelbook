// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper } from 'swiper/react';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius, shadow, typography } from '@/shared/styles/variables';

export const Root = styled(Swiper)`
  position: static;

  .swiper-pagination {
    bottom: -3px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    /* Layout */
    ${mixins.display.flex.flexContentCenter}

    /* Box model */
    width: 35px;
    height: 35px;

    /* Styling */
    background-color: ${colors.white};
    color: ${colors.black};
    border-radius: ${radius.full};
    box-shadow: ${shadow.medium};

    /* Animation */
    transition: background-color 0.3s linear;

    &:hover {
      background-color: ${colors.gray[200]};
    }

    &::after {
      font-size: ${typography.fontSize.extraSmall};
    }
  }

  .swiper-button-next {
    right: -16px;
  }

  .swiper-button-prev {
    left: -16px;
  }

  .swiper-button-next > svg {
    width: 18px;
    height: 18px;
  }

  .swiper-button-prev > svg {
    width: 18px;
    height: 18px;
  }

  .swiper-button-disabled {
    display: none;
  }
`;

export const Wrapper = styled.div`
  position: relative;

  display: grid;
  justify-content: start;

  .swiper {
    max-width: 100% !important;
  }
`;
