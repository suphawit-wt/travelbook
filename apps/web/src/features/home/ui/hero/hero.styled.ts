// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  /* Layout */
  position: relative;

  /* Box model */
  height: 48vh;
  max-height: 434px;
  margin-bottom: 270px;

  /* Styling */
  background-color: ${colors.black};

  @media ${media.minLaptop} {
    /* Box model */
    margin-bottom: 100px;
  }
`;
