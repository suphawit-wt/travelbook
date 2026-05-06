// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextLink from 'next/link';
import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors } from '@/shared/styles/variables';

import type { StyledIconButtonLinkProps } from './icon-button-link.types';

export const StyledIconButtonLink = styled(NextLink)<StyledIconButtonLinkProps>`
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

  /* Animation */
  will-change: transform;
  transition: transform 0.1s ease;

  ${(props) =>
    props.$isActive &&
    css`
      border: 1px solid currentColor;

      background-color: ${colors.overlay.light};
    `}

  svg + span {
    margin-left: 0.5em;
  }
`;
