// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { StyledTextProps } from './text.types';

export const StyledText = styled.span<StyledTextProps>`
  line-height: 2rem;

  &:has(svg) {
    display: flex;
    align-items: center;
  }

  div + span {
    margin-left: 0.45em;
  }

  span + div {
    margin-left: 0.45em;
  }

  /* Styling */
  ${mixins.typography.fontColor}
  ${mixins.typography.fontSize}
  ${mixins.typography.fontWeight}
  ${mixins.typography.textShadow}
  ${mixins.typography.textAlign}
  ${mixins.typography.textUnderline}
`;
