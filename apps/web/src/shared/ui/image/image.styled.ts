// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextImage from 'next/image';
import { css, styled } from 'styled-components';

import { radius } from '@/shared/styles/variables';

import type { ImageProps } from './image.types';

export const Image = styled(NextImage)<ImageProps>`
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
          min-width: 100px;
          max-width: 140px;
          max-height: 25px;
        `;
      default:
        return css``;
    }
  }}

  ${(props) => {
    switch (props.$shape) {
      case 'circle':
        return css`
          border-radius: ${radius.full};
        `;
      default:
        return css``;
    }
  }}
`;
