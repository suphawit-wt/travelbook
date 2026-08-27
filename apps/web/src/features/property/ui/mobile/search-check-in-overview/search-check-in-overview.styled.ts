// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  margin: 12px 8px;
  padding: 16px;
  background-color: ${colors.background.base};
  border-radius: ${radius.large};
  border: 1px solid ${colors.separator};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 16px;
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
