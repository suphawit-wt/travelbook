// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type { IconColor, Size } from '@/shared/types/components';

import { colors } from '../variables';

interface IconColorProps {
  $color?: IconColor;
}

export const iconColor = css<IconColorProps>`
  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        return css`
          color: ${colors.indigo[500]};
        `;
      case 'blue':
        return css`
          color: ${colors.blue[500]};
        `;
      case 'green':
        return css`
          color: ${colors.green[500]};
        `;
      case 'yellow':
        return css`
          color: ${colors.yellow[500]};
        `;
      case 'orange':
        return css`
          color: ${colors.orange[500]};
        `;
      case 'red':
        return css`
          color: ${colors.red[500]};
        `;
      case 'gray':
        return css`
          color: ${colors.gray[500]};
        `;
      case 'white':
        return css`
          color: ${colors.white};
        `;
      case 'black':
        return css`
          color: ${colors.black};
        `;
      case 'default':
      default:
        return css`
          color: currentColor;
        `;
    }
  }};
`;

interface IconSizeProps {
  $size?: Size;
}

export const iconSize = css<IconSizeProps>`
  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          & > svg {
            width: 14px;
            height: 14px;
          }
        `;
      case 'sm':
        return css`
          & > svg {
            width: 16px;
            height: 16px;
          }
        `;
      case 'lg':
        return css`
          & > svg {
            width: 24px;
            height: 24px;
          }
        `;
      case 'xl':
        return css`
          & > svg {
            width: 30px;
            height: 30px;
          }
        `;
      case '2xl':
        return css`
          & > svg {
            width: 36px;
            height: 36px;
          }
        `;
      case '3xl':
        return css`
          & > svg {
            width: 48px;
            height: 48px;
          }
        `;
      case '4xl':
        return css`
          & > svg {
            width: 60px;
            height: 60px;
          }
        `;
      case '5xl':
        return css`
          & > svg {
            width: 64px;
            height: 64px;
          }
        `;
      case '6xl':
        return css`
          & > svg {
            width: 70px;
            height: 70px;
          }
        `;
      case 'md':
      default:
        return css`
          & > svg {
            width: 20px;
            height: 20px;
          }
        `;
    }
  }};
`;
