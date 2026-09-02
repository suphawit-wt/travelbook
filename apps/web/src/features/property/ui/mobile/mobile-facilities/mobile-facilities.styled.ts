// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const FacilityList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;

  & > li {
    margin-block-end: 8px;
  }
`;

export const Wrapper = styled.section`
  margin-bottom: 8px;
  padding: 16px;
  background-color: ${colors.background.base};

  & > button {
    padding: 0px;
  }
`;
