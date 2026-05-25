// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, zIndex } from '@/shared/styles/variables';
import { Image } from '@/shared/ui';

export const BackgroundOverlay = styled.div`
  /* Layout */
  position: absolute;
  z-index: ${zIndex.baseOverlay};

  /* Box model */
  width: 100%;
  height: 100%;

  @media ${media.minDesktop} {
    background:
      linear-gradient(90deg, ${colors.black} 11.5%, transparent 22.5%),
      linear-gradient(270deg, ${colors.black} 11.5%, transparent 22.5%);
  }
`;

export const BannerImage = styled(Image)`
  /* Layout */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  object-position: center;
  z-index: ${zIndex.base};

  /* Box model */
  width: 100%;
  height: 99.7%;
  max-width: 1440px;

  @media ${media.minDesktop} {
    /* Layout */
    object-fit: contain;
  }

  @media ${media.minLargeDesktop} {
    /* Layout */
    object-fit: cover;

    /* Box model */
    max-width: none;
  }
`;

export const Content = styled.div`
  /* Layout */
  position: absolute;
  ${mixins.display.flex.flexItemCenter}
  z-index: ${zIndex.content};

  /* Box model */
  width: 100%;
  height: 100%;

  & > div > h1 {
    line-height: 38px;
  }

  @media ${media.minDesktop} {
    & > div > h1 {
      line-height: 62px;
    }
  }
`;
