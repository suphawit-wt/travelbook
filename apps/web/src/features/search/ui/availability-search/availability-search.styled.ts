// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius, typography } from '@/shared/styles/variables';

export const Form = styled.form`
  /* Box model */
  width: 900px;

  margin: 8px 0 18px 0;
`;

export const SearchBar = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: 3fr 3fr 1.2fr;

  /* Box model */
  padding: 2px;
  max-width: 800px;
  gap: 3px;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border-radius: ${radius.medium};

  & > button:last-child {
    /* Box model */
    width: 100%;
    height: 100%;
    min-width: 160px;

    /* Styling */
    line-height: 6px;
    font-weight: ${typography.fontWeight.medium};

    @media ${media.minLaptop} {
      padding: 16px 24px;
    }
  }
`;
