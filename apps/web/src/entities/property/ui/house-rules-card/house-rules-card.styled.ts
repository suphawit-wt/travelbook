// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, spacing, typography } from '@/shared/styles/variables';

export const RuleItem = styled.div`
  & > hr {
    height: 1px;
    width: initial;
    background-color: ${colors.separator};
  }
`;

export const RuleItemContent = styled.div`
  /* Box model */
  width: 100%;
  display: flex;
  padding: 16px;
`;

export const RuleTitle = styled.div`
  width: 250px;
  margin-right: 16px;
`;

export const RuleDetail = styled.div`
  max-width: 500px;
  font-size: ${typography.fontSize.small};
`;

export const ExtraBedPoliciesItem = styled.div`
  border: 1px solid ${colors.separator};
  border-radius: 3px;
  margin: 16px 0;
  max-width: 640px;
`;

export const ExtraBedPoliciesTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.medium};
`;

export const ExtraBedPoliciesContent = styled.div`
  padding: 8px;
  border-top: 1px solid ${colors.separator};
  display: flex;
  justify-content: flex-start;
  gap: ${spacing.gap.extraLarge};
`;

export const ChildPoliciesGroup = styled.div`
  margin: 0 0 16px;
`;
