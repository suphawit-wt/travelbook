// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { StyledButtonProps } from './button.types';

export const StyledButton = styled.button<StyledButtonProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Box model */
  ${mixins.button.buttonSize}
  ${mixins.boxModel.borderRadius}

  /* Styling */
  ${mixins.button.buttonVariant}
  ${mixins.button.buttonShadow}
  ${mixins.typography.textUnderline}

  /* Animation */
  will-change: transform;
  transition: transform 0.1s ease;
  ${mixins.button.buttonPressEffect}

  div + span {
    margin-left: 0.5em;
  }

  span + div {
    margin-left: 0.5em;
  }
`;
