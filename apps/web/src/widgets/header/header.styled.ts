// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.header`
  /* Box model */
  padding: 16px 0;

  /* Styling */
  background-color: ${colors.primary};
  color: ${colors.white};

  button:hover,
  a:hover {
    /* Styling */
    background-color: ${colors.overlay.light};
  }
`;
