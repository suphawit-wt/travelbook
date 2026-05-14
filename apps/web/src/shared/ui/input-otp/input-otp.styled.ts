// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius, typography } from '@/shared/styles/variables';

import type { StyledSlotProps } from './input-otp.types';

export const Wrapper = styled.div`
  & > div.otp-input {
    ${mixins.display.flex.flexItemCenter}

    &:has(input:disabled) {
      opacity: 0.3;
    }
  }
`;

export const SlotGroup = styled.div`
  /* Layout */
  display: flex;
  gap: 0.8rem;
  max-width: 88vw;
`;

export const Slot = styled.div<StyledSlotProps>`
  /* Layout */
  position: relative;
  ${mixins.display.flex.flexContentCenter}

  /* Box model */
  width: 49px;
  height: 56px;
  border: 1px solid ${colors.gray[500]};

  /* Styling */
  font-size: ${typography.fontSize.extraLarge};
  text-transform: uppercase;
  border-radius: ${radius.small};

  /* Animation */
  transition: all 0.3s;

  ${(props) =>
    props.$isError &&
    css`
      border: 1px solid ${colors.red[500]};
    `}

  ${(props) =>
    props.$isActive &&
    css`
      border: 1px solid ${colors.blue[500]};
    `}

  ${(props) =>
    props.$isSuccess &&
    css`
      border: 1px solid ${colors.green[500]};
    `}
`;
