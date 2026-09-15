// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius, spacing } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  margin: 0 10px 8px;
`;

export const AvailabilityGroup = styled.div`
  padding: 10px 0px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AvailabilityCard = styled.div`
  padding: 8px;
  background-color: ${colors.background.base};
  border: 1px solid ${colors.separator};

  display: flex;
  gap: ${spacing.gap.large};
  flex-direction: column;
  justify-content: space-between;
`;

export const CardContent = styled.div``;

export const ContentBottom = styled.div`
  display: flex;
  gap: ${spacing.gap.large};
  justify-content: space-between;
  align-items: flex-end;
`;

export const PriceInfo = styled.div``;

export const TitleButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  background-color: transparent;
`;

export const AvailabilityLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.gap.small};
`;

export const FacilityGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.gap.small};
  margin: 6px 0 10px;
`;

export const FacilityTag = styled.span`
  padding: 1px 4px;
  border: 1px solid ${colors.text.base};
  border-radius: ${radius.small};
  display: flex;
  align-items: center;
  gap: 2px;
`;
