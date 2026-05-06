// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextLink from 'next/link';
import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors } from '@/shared/styles/variables';

import type { StyledButtonLinkProps } from './button-link.types';

export const StyledButtonLink = styled(NextLink)<StyledButtonLinkProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;

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

  ${(props) =>
    props.$isActive &&
    css`
      border: 1px solid currentColor;

      background-color: ${colors.overlay.light};
    `}

  div + span {
    margin-left: 0.5em;
  }

  span + div {
    margin-left: 0.5em;
  }
`;
