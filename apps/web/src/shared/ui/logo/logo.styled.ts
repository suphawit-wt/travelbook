// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextImage from 'next/image';
import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';

import type { LogoProps } from './logo.types';

export const LogoStyled = styled(NextImage)<LogoProps>`
  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          min-width: 70px;
          max-width: 110px;
          max-height: 16px;
        `;
      case 'md':
        return css`
          min-width: 70px;
          max-width: 120px;
          max-height: 20px;

          @media ${media.minLaptop} {
            min-width: 100px;
            max-width: 140px;
            max-height: 25px;
          }
        `;
      default:
        return css``;
    }
  }}

  ${(props) => {
    switch (props.$color) {
      case 'white':
        return css`
          filter: brightness(0) invert(1);
        `;
      case 'black':
        return css`
          filter: brightness(0) invert(0);
        `;
      default:
        return css``;
    }
  }}
`;
