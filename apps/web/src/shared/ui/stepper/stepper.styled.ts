// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, typography } from '@/shared/styles/variables';

import type { StepItemProps } from './stepper.types';

export const StepNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  line-height: 100%;
  margin-inline-end: 10px;

  width: 24px;
  height: 24px;
  border: 2px solid ${colors.text.description};
  border-radius: 50%;

  color: ${colors.text.description};
  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.bold};
`;

export const StepLabel = styled.strong`
  display: none;

  color: ${colors.text.description};
  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.bold};

  @media ${media.minTablet} {
    display: block;
  }
`;

export const StepMobileLabel = styled.div`
  text-align: center;
  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.bold};

  @media ${media.minTablet} {
    display: none;
  }
`;

export const StepConnector = styled.span`
  flex: 1;
  background-color: ${colors.separator};
  height: 1px;
  margin: 0 8px;
  min-width: 16px;
`;

export const StepItem = styled.li<StepItemProps>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;

  ${(props) =>
    props.$isActive &&
    css`
      & > ${StepNumber} {
        color: ${colors.white};
        background-color: ${colors.blue[500]};
        border-color: ${colors.blue[500]};
      }

      & > ${StepLabel} {
        color: ${colors.text.base};
      }
    `}
`;

export const Wrapper = styled.ol`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: initial;

  & > ${StepItem}:last-child {
    flex-grow: 0;
  }

  @media ${media.maxTablet} {
    margin-bottom: 8px;
  }
`;
