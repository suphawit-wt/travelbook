// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Card = styled.div`
  padding: 14px;
  border: 1px solid ${colors.separator};
  background-color: ${colors.background.base};

  @media ${media.minLaptop} {
    border-radius: 8px;
  }
`;

export const TotalPriceBox = styled.div`
  padding: 16px;
  background-color: ${colors.blue[100]};
  border: 1px solid ${colors.separator};
  border-left: 0;
  border-right: 0;
`;

export const TotalPriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
  flex-wrap: nowrap;

  color: ${colors.black};
`;

export const TotalPriceDetail = styled.div`
  display: flex;
  justify-content: flex-end;

  color: ${colors.gray[600]};
`;

export const PriceInfoBox = styled.div`
  padding: 16px;
`;

export const PriceInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;
