// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

import type { SkeletonProps } from './skeleton.types';

export const Skeleton = styled.div<SkeletonProps>`
  /* Box model */
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '40px'};

  /* Styling */
  background-color: ${colors.gray[200]};
  border-radius: ${radius.small};

  /* Animation */
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;
