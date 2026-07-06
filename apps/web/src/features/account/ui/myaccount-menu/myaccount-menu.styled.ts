// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  /* Box model */
  margin: 30px 0;
  min-height: 75vh;
`;

export const MenuGroup = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 30px;

  @media ${media.minTablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const IconDisplay = styled.div`
  /* Layout */
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Box model */
  border-radius: ${radius.full};

  /* Styling */
  background-color: ${colors.separator};

  /* Animation */
`;

export const CardContent = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Card = styled.div`
  /* Layout */
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;

  /* Box model */
  height: 100%;
  border-radius: 8px;

  /* Styling */
  border: 1px solid ${colors.separator};

  /* Animation */

  &:hover {
    & > div > ${IconDisplay} > div > svg {
      color: ${colors.blue[500]};
    }

    & > ${CardContent} {
      color: ${colors.blue[500]};

      & > span:last-child {
        text-decoration: underline;
      }
    }
  }
`;
