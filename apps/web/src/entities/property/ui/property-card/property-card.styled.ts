// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, spacing } from '@/shared/styles/variables';

export const RecommendUnit = styled.p`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 6px;
  padding-left: 10px;

  &::before {
    content: ' ';
    width: 1px;
    height: 100%;
    border-left: 2px solid ${colors.separator};
    position: absolute;
    left: 0;
    top: 2px;
    z-index: 0;
  }
`;

export const RoomDetailBox = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 6px;
`;

export const RecommendUnitPortrait = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.extraSmall};
`;
