// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, spacing } from '@/shared/styles/variables';

export const Wrapper = styled.nav`
  /* Box model */
  margin-top: 2em;
  padding: 20px 0;
  border-top: 1px solid ${colors.separator};

  & > ul {
    /* Layout */
    ${mixins.display.flex.flexItemCenter}
    flex-wrap: wrap;
    gap: ${spacing.gap.small};

    & > li:not(:last-child)::after {
      content: '.';

      /* Box model */
      margin-left: 5px;
    }
  }
`;
