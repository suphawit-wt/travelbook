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

export const BookingDetailDateSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CheckInOutItem = styled.time`
  display: inline-block;
  position: relative;
`;

export const DateCheckInOutSummary = styled.div`
  display: flex;
  flex-wrap: nowrap;

  & > ${CheckInOutItem}:first-child {
    padding-inline-end: 16px;
  }

  & > ${CheckInOutItem}:last-child {
    padding-inline-start: 16px;
  }
`;
