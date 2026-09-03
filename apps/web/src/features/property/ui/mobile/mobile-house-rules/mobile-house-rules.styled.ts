// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, spacing, typography } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  background-color: ${colors.background.base};
  margin-bottom: 8px;
`;

export const InfoItem = styled.li`
  & > div {
    padding: 4px 16px;
  }
`;

export const InfoList = styled.ul`
  & > ${InfoItem}:not(:last-child) {
    border-bottom: 1px solid ${colors.separator};
  }
`;

export const RulesItem = styled.li`
  padding: 10px 0;
`;

export const RulesList = styled.ul`
  & > ${RulesItem}:not(:last-child) {
    border-bottom: 1px solid ${colors.separator};
  }
`;

export const ExtraBedPoliciesItem = styled.div`
  border: 1px solid ${colors.separator};
  border-radius: 3px;
  max-width: 640px;
`;

export const ExtraBedPoliciesTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: ${typography.fontSize.extraSmall};
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

export const FaqItemWrapper = styled.div`
  margin: 6px 16px;
`;
