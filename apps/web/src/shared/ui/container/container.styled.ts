// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';

import type { ContainerProps } from './container.types';

export const Container = styled.div<ContainerProps>`
  /* Box model */
  width: 100%;
  max-width: 90vw;
  margin: 0 auto;

  @media ${media.minLaptop} {
    max-width: 80vw;
  }

  @media ${media.minDesktop} {
    max-width: 58vw;
  }

  ${(props) =>
    props.$fluidMobile &&
    css`
      max-width: initial;
    `}

  ${mixins.display.showOnly}
`;
