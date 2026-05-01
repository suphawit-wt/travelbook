// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { spacing, typography } from '@/shared/styles/variables';

import type { BreadcrumbsRootProps } from './breadcrumbs.types';

export const Item = styled.li``;

export const List = styled.ol`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}
  flex-wrap: wrap;
  gap: ${spacing.gap.small};

  /* Box model */

  /* Styling */
  list-style: none;

  /* Animation */

  & > svg {
    width: 1.35em;
    height: 1.35em;
  }
`;

export const Root = styled.nav<BreadcrumbsRootProps>`
  /* Layout */
  ${mixins.display.showOnly}

  /* Box model */

  /* Styling */

  /* Animation */

  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          & > ${List} {
            font-size: ${typography.fontSize.extraSmall} !important;
          }
        `;
      case 'lg':
        return css`
          & > ${List} {
            font-size: ${typography.fontSize.medium} !important;
          }
        `;
      case 'md':
      default:
        return css`
          & > ${List} {
            font-size: ${typography.fontSize.small} !important;
          }
        `;
    }
  }}
`;
