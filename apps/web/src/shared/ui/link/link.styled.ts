// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextLink from 'next/link';
import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { StyledLinkProps } from './link.types';

export const StyledLink = styled(NextLink)<StyledLinkProps>`
  /* Styling */
  ${mixins.typography.linkColor}
  ${mixins.typography.fontSize}
  ${mixins.typography.fontWeight}
  ${mixins.typography.textUnderline}
`;
