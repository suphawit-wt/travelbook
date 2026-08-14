// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, typography } from '@/shared/styles/variables';
import { Swiper } from '@/shared/ui';

export const Wrapper = styled.section`
  @media ${media.minLaptop} {
    display: none;
  }
`;

export const Header = styled.div`
  padding: 16px;
`;

export const AddressGroup = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const HotelPageTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const DetailGroup = styled.div`
  display: flex;
  align-self: flex-end;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 4px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-height: 62vh;
  aspect-ratio: 4 / 3;

  & > img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
`;

export const SwiperWrapper = styled.div`
  position: relative;
`;

export const SwiperRoot = styled(Swiper.Root)`
  width: 100%;

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    -webkit-backface-visibility: visible !important;
    backface-visibility: visible !important;
    transform: translate3d(0, 0, 0);
  }

  .swiper-button-next,
  .swiper-button-prev {
    /* Styling */
    background-color: hsla(0, 0%, 100%, 0.7);
    border-radius: 0px;
    box-shadow: none;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.7);
    }
  }

  .swiper-button-next {
    right: 0px;
  }

  .swiper-button-prev {
    left: 0px;
  }

  .swiper-pagination {
    color: ${colors.white};
    font-size: ${typography.fontSize.extraSmall};
  }

  .swiper-pagination-fraction {
    border-radius: 4px;
    width: initial;
    padding: 10px 12px;
    background-color: hsla(0, 0%, 0%, 0.4);
    text-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.35);

    right: 10px;
    bottom: 10px;
    left: unset;
  }
`;
