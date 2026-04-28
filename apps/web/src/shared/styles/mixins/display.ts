// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type { Breakpoint } from '@/shared/types/components';

import { media } from '../breakpoints';
import { spacing } from '../variables';

export const flexItemCenter = css`
  display: flex;
  align-items: center;
`;

export const flexItemCenterWithGap = css`
  display: flex;
  align-items: center;
  gap: ${spacing.gap.medium};
`;

export const flexContentCenter = css`
  ${flexItemCenter}
  justify-content: center;
`;

export const flexContentSpaceBetween = css`
  ${flexItemCenter}
  justify-content: space-between;
`;

export const flexColumnFlexStart = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

interface ShowOnlyProps {
  $showOnly?: Breakpoint;
}

export const showOnly = css<ShowOnlyProps>`
  ${(props) => {
    switch (props.$showOnly) {
      case 'mobile':
        return css`
          @media ${media.minLaptop} {
            display: none;
          }
        `;
      case 'desktop':
        return css`
          @media ${media.maxLaptop} {
            display: none;
          }
        `;
      default:
        return css``;
    }
  }};
`;
