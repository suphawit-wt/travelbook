// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

import type { HeaderNavProps } from './auth-header-bar.types';

export const Wrapper = styled.div`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}

  & > a:first-child:hover {
    /* Styling */
    background-color: unset;
  }
`;

export const Nav = styled.nav<HeaderNavProps>`
  /* Layout */
  ${mixins.display.showOnly}

  & > ul {
    /* Layout */
    ${mixins.display.flex.flexItemCenterWithGap}
  }
`;
