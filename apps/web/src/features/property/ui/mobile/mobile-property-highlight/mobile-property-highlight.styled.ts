// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

export const FacilityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${radius.full};
  background-color: ${colors.background.secondary};
`;

export const FacilityCardContent = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const FacilityList = styled.ul`
  display: flex;
  gap: 8px;
  overflow-x: auto;

  & > li {
    flex-shrink: 0;
  }
`;

export const Wrapper = styled.section`
  margin-top: 8px;
  padding: 16px;
  background-color: ${colors.background.base};
`;

export const FacilityCardButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  background-color: ${colors.background.base};
`;
