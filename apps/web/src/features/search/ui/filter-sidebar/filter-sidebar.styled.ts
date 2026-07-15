// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius, spacing } from '@/shared/styles/variables';

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 10px;
`;

export const Group = styled.div`
  /* Layout */
  padding: 12px;
  display: flex;
  flex-direction: column;

  /* Box model */

  /* Styling */
`;

export const Wrapper = styled.aside`
  /* Layout */
  display: inline-block;
  width: 25%;
  margin-right: 16px;

  /* Box model */
  border: 1px solid ${colors.separator};
  border-radius: ${radius.medium};

  /* Styling */

  & > ${Group}:not(:last-child) {
    border-bottom: 1px solid ${colors.separator};
  }

  @media ${media.maxLaptop} {
    display: none;
  }
`;

export const RatingLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.gap.small};
`;
