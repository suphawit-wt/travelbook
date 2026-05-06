// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { StyledIconButtonProps } from './icon-button.types';

export const StyledIconButton = styled.button<StyledIconButtonProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;

  /* Box model */
  ${mixins.button.iconButtonSize}
  ${mixins.boxModel.borderRadius}

  /* Styling */
  ${mixins.button.buttonVariant}
  ${mixins.button.buttonShadow}

  /* Animation */
  will-change: transform;
  transition: transform 0.1s ease;
  ${mixins.button.buttonPressEffect}

  svg + span {
    margin-left: 0.5em;
  }
`;
