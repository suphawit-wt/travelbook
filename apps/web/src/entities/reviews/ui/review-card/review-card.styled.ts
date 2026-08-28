// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius, typography } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  padding: 14px;
  border-radius: ${radius.large};
  border: 1px solid ${colors.separator};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const UserInfo = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  /* Box model */

  /* Styling */

  /* Animation */
`;

export const ProfileDisplay = styled.div`
  width: 32px;
  height: 32px;
  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.bold};
  border-radius: ${radius.full};
  background-color: ${colors.green[700]};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

export const CountryDisplay = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`;

export const UserInfoRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ReadMoreWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
