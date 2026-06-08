// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { colors, radius, typography } from '@/shared/styles/variables';

import type { RatingProps } from './review-info.types';

export const FeedbackBox = styled.div`
  /* Box model */
  display: flex;
  gap: 10px;
`;

export const FeedbackLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Rating = styled.span<RatingProps>`
  /* Box model */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Styling */
  background-color: ${colors.indigo[600]};
  color: ${colors.white};
  border-radius: ${radius.small};
  border-bottom-left-radius: 0;

  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          width: 25px;
          height: 24px;

          /* Styling */
          font-size: ${typography.fontSize.small};
        `;
      case 'sm':
        return css`
          width: 28px;
          height: 28px;

          /* Styling */
          font-size: ${typography.fontSize.small};
        `;
      case 'lg':
        return css`
          width: 36px;
          height: 36px;

          /* Styling */
          font-size: ${typography.fontSize.large};
        `;
      case 'md':
      default:
        return css`
          width: 32px;
          height: 32px;

          /* Styling */
          font-size: ${typography.fontSize.medium};
        `;
    }
  }};
`;
