// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${colors.background.secondary};

  @media ${media.minLaptop} {
    display: none;
  }
`;
