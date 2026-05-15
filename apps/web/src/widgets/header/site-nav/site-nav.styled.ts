// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';

export const Wrapper = styled.nav`
  /* Box model */
  margin-top: 0.8rem;

  & > ul {
    /* Layout */
    ${mixins.display.flex.flexItemCenterWithGap}
    overflow-x: auto;

    & > li {
      flex-shrink: 0;
    }
  }
`;
