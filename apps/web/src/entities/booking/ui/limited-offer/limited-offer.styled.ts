// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const AlertCard = styled.div`
  padding: 16px;
  background-color: ${colors.red[100]};
  border: 1px solid ${colors.red[500]};

  display: flex;
  align-items: flex-start;
  gap: 16px;

  @media ${media.minLaptop} {
    border-radius: 8px;
  }
`;

export const AlertDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
