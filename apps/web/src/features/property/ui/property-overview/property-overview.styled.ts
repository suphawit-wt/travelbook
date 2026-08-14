// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { spacing } from '@/shared/styles/variables';

export const HotelPageTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.small};
`;

export const AddressGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${spacing.gap.small};
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 10px;

  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
