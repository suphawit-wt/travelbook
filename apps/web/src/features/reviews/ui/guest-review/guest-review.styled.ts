// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { Swiper } from '@/shared/ui';

export const Wrapper = styled.section`
  padding: 10px 0;
`;

export const ReviewTopicsGroup = styled.div`
  margin-top: 14px;
  margin-bottom: 26px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SwiperRoot = styled(Swiper.Root)`
  .swiper-wrapper {
    margin-bottom: 5px;
  }

  .swiper-wrapper > .swiper-slide {
    min-width: 330px;
  }
`;
