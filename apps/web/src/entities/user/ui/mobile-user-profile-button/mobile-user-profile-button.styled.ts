// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

export const ProfileAvatarWrapper = styled.div`
  /* Layout */
  display: flex;
`;

export const ProfileAvatar = styled.div`
  /* Layout */
  display: inline-flex;
  user-select: none;
  position: relative;
  overflow: hidden;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border: 2px solid ${colors.yellow[500]};
  border-radius: ${radius.full};
  width: 24px;
  height: 24px;

  & > img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
