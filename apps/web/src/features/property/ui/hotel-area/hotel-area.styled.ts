// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  margin-top: 48px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NearbyAreaGroup = styled.div`
  margin: 24px 0;
  columns: 3;
  column-gap: 40px;
`;

export const AreaGroup = styled.div`
  margin-block-end: 40px;
  page-break-inside: avoid;
  break-inside: avoid-column;
`;

export const AreaItemList = styled.ul``;

export const AreaItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 10px;
`;

export const AreaType = styled.span`
  color: ${colors.text.description};

  &::after {
    content: '';
    display: inline-block;
    margin-inline: 6px;
    width: 3px;
    height: 3px;
    vertical-align: middle;
    border-radius: 9999px;
    background-color: ${colors.text.description};
  }
`;
