// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, spacing } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  margin-top: 48px;
`;

export const FaqCardGroup = styled.div`
  margin-top: 20px;
  display: flex;
  gap: ${spacing.gap.extraLarge};
`;

export const Card = styled.div`
  border-radius: 8px;
  border: 1px solid ${colors.separator};
  flex-basis: 50%;
  height: fit-content;
`;

export const FaqItemWrapper = styled.div`
  margin: 6px 16px;
`;
