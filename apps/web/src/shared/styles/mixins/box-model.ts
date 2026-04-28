// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type { Radius } from '@/shared/types/components';

import { radius } from '../variables';

interface BorderRadiusProps {
  $radius?: Radius;
}

export const borderRadius = css<BorderRadiusProps>`
  ${(props) => {
    switch (props.$radius) {
      case 'none':
        return css`
          border-radius: 0;
        `;
      case 'md':
        return css`
          border-radius: ${radius.medium};
        `;
      case 'lg':
        return css`
          border-radius: ${radius.large};
        `;
      case 'xl':
        return css`
          border-radius: ${radius.extraLarge};
        `;
      case 'full':
        return css`
          border-radius: ${radius.full};
        `;
      case 'sm':
      default:
        return css`
          border-radius: ${radius.small};
        `;
    }
  }};
`;
