// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type { Color, Size } from '@/shared/types/components';

import { colors, typography } from '../variables';

interface BadgeSizeProps {
  $size?: Size;
}

export const badgeSize = css<BadgeSizeProps>`
  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraSmall};
        `;
      case 'sm':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.small};
        `;
      case 'lg':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.large};
        `;
      case 'xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge};
        `;
      case '2xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge2};
        `;
      case '3xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge3};
        `;
      case '4xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge4};
        `;
      case '5xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge5};
        `;
      case '6xl':
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.extraLarge6};
        `;
      case 'md':
      default:
        return css`
          padding: 3px 4px;
          font-size: ${typography.fontSize.medium};
        `;
    }
  }};
`;

interface BadgeColorProps {
  $color?: Color;
}

export const badgeColor = css<BadgeColorProps>`
  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        return css`
          background-color: ${colors.indigo[700]};
        `;
      case 'blue':
        return css`
          background-color: ${colors.blue[700]};
        `;
      case 'green':
        return css`
          background-color: ${colors.green[700]};
        `;
      case 'yellow':
        return css`
          background-color: ${colors.yellow[700]};
        `;
      case 'orange':
        return css`
          background-color: ${colors.orange[700]};
        `;
      case 'red':
        return css`
          background-color: ${colors.red[700]};
        `;
      case 'gray':
        return css`
          background-color: ${colors.gray[700]};
        `;
      default:
        return css``;
    }
  }};
`;
