// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type {
  ButtonVariant,
  Color,
  IconSize,
  PressEffect,
  Shadow,
  Size,
} from '@/shared/types/components';

import { colors, shadow, typography } from '../variables';

interface ButtonPressEffectProps {
  $pressEffect?: PressEffect;
}

export const buttonPressEffect = css<ButtonPressEffectProps>`
  ${(props) => {
    switch (props.$pressEffect) {
      case 'scale':
        return css`
          &:active {
            transform: scale(0.95);
          }
        `;
      default:
        return css``;
    }
  }};
`;

interface ButtonShadowProps {
  $shadow?: Shadow;
}

export const buttonShadow = css<ButtonShadowProps>`
  ${(props) => {
    switch (props.$shadow) {
      case 'sm':
        return css`
          box-shadow: ${shadow.small};
        `;
      case 'md':
        return css`
          box-shadow: ${shadow.medium};
        `;
      case 'lg':
        return css`
          box-shadow: ${shadow.large};
        `;
      default:
        return css``;
    }
  }};
`;

interface ButtonSizeProps {
  $size?: Size;
}

export const buttonSize = css<ButtonSizeProps>`
  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          padding: 8px 10px;
          font-size: ${typography.fontSize.extraSmall};
        `;
      case 'sm':
        return css`
          padding: 8px 12px;
          font-size: ${typography.fontSize.small};
        `;
      case 'lg':
        return css`
          padding: 10px 14px;
          font-size: ${typography.fontSize.large};
        `;
      case 'xl':
        return css`
          padding: 12px 14px;
          font-size: ${typography.fontSize.extraLarge};
        `;
      case '2xl':
        return css`
          padding: 14px 18px;
          font-size: ${typography.fontSize.extraLarge2};
        `;
      case '3xl':
        return css`
          padding: 16px 20px;
          font-size: ${typography.fontSize.extraLarge3};
        `;
      case '4xl':
        return css`
          padding: 18px 22px;
          font-size: ${typography.fontSize.extraLarge4};
        `;
      case '5xl':
        return css`
          padding: 20px 24px;
          font-size: ${typography.fontSize.extraLarge5};
        `;
      case '6xl':
        return css`
          padding: 22px 26px;
          font-size: ${typography.fontSize.extraLarge6};
        `;
      case 'md':
      default:
        return css`
          padding: 10px 12px;
          font-size: ${typography.fontSize.medium};
        `;
    }
  }};
`;

interface IconButtonSizeProps {
  $size?: IconSize;
}

export const iconButtonSize = css<IconButtonSizeProps>`
  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          padding: 8px 8px;
        `;
      case 'sm':
        return css`
          padding: 10px 10px;
        `;
      case 'md':
        return css`
          padding: 12px 12px;
        `;
      case 'lg':
        return css`
          padding: 14px 14px;
        `;
      default:
        return css``;
    }
  }};
`;

interface ButtonVariantProps {
  $variant?: ButtonVariant;
  $color?: Color;
}

export const buttonVariant = css<ButtonVariantProps>`
  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.indigo[100]};
              color: ${colors.indigo[500]};
              -webkit-text-fill-color: ${colors.indigo[500]};

              &:hover {
                background-color: ${colors.indigo[200]} !important;
                color: ${colors.indigo[600]};
                -webkit-text-fill-color: ${colors.indigo[600]};
              }

              &:active {
                background-color: ${colors.indigo[300]} !important;
                color: ${colors.indigo[700]};
                -webkit-text-fill-color: ${colors.indigo[700]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.indigo[100]};
              color: ${colors.indigo[500]};
              -webkit-text-fill-color: ${colors.indigo[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.indigo[200]} !important;
                color: ${colors.indigo[600]} !important;
                -webkit-text-fill-color: ${colors.indigo[600]} !important;
              }

              &:active {
                background-color: ${colors.indigo[300]} !important;
                color: ${colors.indigo[700]} !important;
                -webkit-text-fill-color: ${colors.indigo[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.indigo[500]};
              -webkit-text-fill-color: ${colors.indigo[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.indigo.a1} !important;
                color: ${colors.indigo[600]} !important;
                -webkit-text-fill-color: ${colors.indigo[600]} !important;
              }

              &:active {
                background-color: ${colors.indigo.a2} !important;
                color: ${colors.indigo[700]} !important;
                -webkit-text-fill-color: ${colors.indigo[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.indigo[500]};
              -webkit-text-fill-color: ${colors.indigo[500]};

              &:hover {
                background-color: ${colors.indigo.a1} !important;
                color: ${colors.indigo[600]} !important;
                -webkit-text-fill-color: ${colors.indigo[600]} !important;
              }

              &:active {
                background-color: ${colors.indigo.a2} !important;
                color: ${colors.indigo[700]} !important;
                -webkit-text-fill-color: ${colors.indigo[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.indigo[500]};
              -webkit-text-fill-color: ${colors.indigo[500]};

              &:hover {
                color: ${colors.indigo[600]} !important;
                -webkit-text-fill-color: ${colors.indigo[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.indigo[700]} !important;
                -webkit-text-fill-color: ${colors.indigo[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.indigo[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.indigo[600]} !important;
              }

              &:active {
                background-color: ${colors.indigo[700]} !important;
              }
            `;
        }
      case 'blue':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.blue[100]};
              color: ${colors.blue[500]};
              -webkit-text-fill-color: ${colors.blue[500]};

              &:hover {
                background-color: ${colors.blue[200]} !important;
                color: ${colors.blue[600]};
                -webkit-text-fill-color: ${colors.blue[600]};
              }

              &:active {
                background-color: ${colors.blue[300]} !important;
                color: ${colors.blue[700]};
                -webkit-text-fill-color: ${colors.blue[700]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.blue[100]};
              color: ${colors.blue[500]};
              -webkit-text-fill-color: ${colors.blue[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.blue[200]} !important;
                color: ${colors.blue[600]} !important;
                -webkit-text-fill-color: ${colors.blue[600]} !important;
              }

              &:active {
                background-color: ${colors.blue[300]} !important;
                color: ${colors.blue[700]} !important;
                -webkit-text-fill-color: ${colors.blue[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.blue[500]};
              -webkit-text-fill-color: ${colors.blue[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.blue.a1} !important;
                color: ${colors.blue[600]} !important;
                -webkit-text-fill-color: ${colors.blue[600]} !important;
              }

              &:active {
                background-color: ${colors.blue.a2} !important;
                color: ${colors.blue[700]} !important;
                -webkit-text-fill-color: ${colors.blue[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.blue[500]};
              -webkit-text-fill-color: ${colors.blue[500]};

              &:hover {
                background-color: ${colors.blue.a1} !important;
                color: ${colors.blue[600]} !important;
                -webkit-text-fill-color: ${colors.blue[600]} !important;
              }

              &:active {
                background-color: ${colors.blue.a2} !important;
                color: ${colors.blue[700]} !important;
                -webkit-text-fill-color: ${colors.blue[700]} !important;
              }

              &:disabled {
                background-color: initial !important;
                color: ${colors.gray[500]} !important;
                -webkit-text-fill-color: ${colors.gray[500]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.blue[500]};
              -webkit-text-fill-color: ${colors.blue[500]};

              &:hover {
                color: ${colors.blue[600]} !important;
                -webkit-text-fill-color: ${colors.blue[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.blue[700]} !important;
                -webkit-text-fill-color: ${colors.blue[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.blue[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.blue[600]} !important;
              }

              &:active {
                background-color: ${colors.blue[700]} !important;
              }

              &:disabled {
                background-color: ${colors.gray[200]} !important;
                color: ${colors.gray[500]};
                -webkit-text-fill-color: ${colors.gray[500]};
              }
            `;
        }
      case 'green':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.green[100]};
              color: ${colors.green[500]};
              -webkit-text-fill-color: ${colors.green[500]};

              &:hover {
                background-color: ${colors.green[200]} !important;
                color: ${colors.green[600]};
                -webkit-text-fill-color: ${colors.green[600]};
              }

              &:active {
                background-color: ${colors.green[300]} !important;
                color: ${colors.green[700]};
                -webkit-text-fill-color: ${colors.green[700]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.green[100]};
              color: ${colors.green[500]};
              -webkit-text-fill-color: ${colors.green[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.green[200]} !important;
                color: ${colors.green[600]} !important;
                -webkit-text-fill-color: ${colors.green[600]} !important;
              }

              &:active {
                background-color: ${colors.green[300]} !important;
                color: ${colors.green[700]} !important;
                -webkit-text-fill-color: ${colors.green[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.green[500]};
              -webkit-text-fill-color: ${colors.green[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.green.a1} !important;
                color: ${colors.green[600]} !important;
                -webkit-text-fill-color: ${colors.green[600]} !important;
              }

              &:active {
                background-color: ${colors.green.a2} !important;
                color: ${colors.green[700]} !important;
                -webkit-text-fill-color: ${colors.green[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.green[500]};
              -webkit-text-fill-color: ${colors.green[500]};

              &:hover {
                background-color: ${colors.green.a1} !important;
                color: ${colors.green[600]} !important;
                -webkit-text-fill-color: ${colors.green[600]} !important;
              }

              &:active {
                background-color: ${colors.green.a2} !important;
                color: ${colors.green[700]} !important;
                -webkit-text-fill-color: ${colors.green[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.green[500]};
              -webkit-text-fill-color: ${colors.green[500]};

              &:hover {
                color: ${colors.green[600]} !important;
                -webkit-text-fill-color: ${colors.green[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.green[700]} !important;
                -webkit-text-fill-color: ${colors.green[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.green[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.green[600]} !important;
              }

              &:active {
                background-color: ${colors.green[700]} !important;
              }
            `;
        }
      case 'yellow':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.yellow[100]};
              color: ${colors.yellow[700]};
              -webkit-text-fill-color: ${colors.yellow[700]};

              &:hover {
                background-color: ${colors.yellow[200]} !important;
              }

              &:active {
                background-color: ${colors.yellow[300]} !important;
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.yellow[100]};
              color: ${colors.yellow[500]};
              -webkit-text-fill-color: ${colors.yellow[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.yellow[200]} !important;
                color: ${colors.yellow[600]} !important;
                -webkit-text-fill-color: ${colors.yellow[600]} !important;
              }

              &:active {
                background-color: ${colors.yellow[300]} !important;
                color: ${colors.yellow[700]} !important;
                -webkit-text-fill-color: ${colors.yellow[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.yellow[500]};
              -webkit-text-fill-color: ${colors.yellow[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.yellow.a1} !important;
                color: ${colors.yellow[600]} !important;
                -webkit-text-fill-color: ${colors.yellow[600]} !important;
              }

              &:active {
                background-color: ${colors.yellow.a2} !important;
                color: ${colors.yellow[700]} !important;
                -webkit-text-fill-color: ${colors.yellow[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.yellow[500]};
              -webkit-text-fill-color: ${colors.yellow[500]};

              &:hover {
                background-color: ${colors.yellow.a1} !important;
                color: ${colors.yellow[600]} !important;
                -webkit-text-fill-color: ${colors.yellow[600]} !important;
              }

              &:active {
                background-color: ${colors.yellow.a2} !important;
                color: ${colors.yellow[700]} !important;
                -webkit-text-fill-color: ${colors.yellow[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.yellow[500]};
              -webkit-text-fill-color: ${colors.yellow[500]};

              &:hover {
                color: ${colors.yellow[600]} !important;
                -webkit-text-fill-color: ${colors.yellow[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.yellow[700]} !important;
                -webkit-text-fill-color: ${colors.yellow[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.yellow[500]};
              color: ${colors.gray[700]};
              -webkit-text-fill-color: ${colors.gray[700]};

              &:hover {
                background-color: ${colors.yellow[600]} !important;
              }

              &:active {
                background-color: ${colors.yellow[700]} !important;
              }
            `;
        }
      case 'orange':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.orange[100]};
              color: ${colors.orange[700]};
              -webkit-text-fill-color: ${colors.orange[700]};

              &:hover {
                background-color: ${colors.orange[200]} !important;
              }

              &:active {
                background-color: ${colors.orange[300]} !important;
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.orange[100]};
              color: ${colors.orange[500]};
              -webkit-text-fill-color: ${colors.orange[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.orange[200]} !important;
                color: ${colors.orange[600]} !important;
                -webkit-text-fill-color: ${colors.orange[600]} !important;
              }

              &:active {
                background-color: ${colors.orange[300]} !important;
                color: ${colors.orange[700]} !important;
                -webkit-text-fill-color: ${colors.orange[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.orange[500]};
              -webkit-text-fill-color: ${colors.orange[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.orange.a1} !important;
                color: ${colors.orange[600]} !important;
                -webkit-text-fill-color: ${colors.orange[600]} !important;
              }

              &:active {
                background-color: ${colors.orange.a2} !important;
                color: ${colors.orange[700]} !important;
                -webkit-text-fill-color: ${colors.orange[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.orange[500]};
              -webkit-text-fill-color: ${colors.orange[500]};

              &:hover {
                background-color: ${colors.orange.a1} !important;
                color: ${colors.orange[600]} !important;
                -webkit-text-fill-color: ${colors.orange[600]} !important;
              }

              &:active {
                background-color: ${colors.orange.a2} !important;
                color: ${colors.orange[700]} !important;
                -webkit-text-fill-color: ${colors.orange[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.orange[500]};
              -webkit-text-fill-color: ${colors.orange[500]};

              &:hover {
                color: ${colors.orange[600]} !important;
                -webkit-text-fill-color: ${colors.orange[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.orange[700]} !important;
                -webkit-text-fill-color: ${colors.orange[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.orange[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.orange[600]} !important;
              }

              &:active {
                background-color: ${colors.orange[700]} !important;
              }
            `;
        }
      case 'red':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.red[100]};
              color: ${colors.red[500]};
              -webkit-text-fill-color: ${colors.red[500]};

              &:hover {
                background-color: ${colors.red[200]} !important;
                color: ${colors.red[600]};
                -webkit-text-fill-color: ${colors.red[600]};
              }

              &:active {
                background-color: ${colors.red[300]} !important;
                color: ${colors.red[700]};
                -webkit-text-fill-color: ${colors.red[700]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.red[100]};
              color: ${colors.red[500]};
              -webkit-text-fill-color: ${colors.red[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.red[200]} !important;
                color: ${colors.red[600]} !important;
                -webkit-text-fill-color: ${colors.red[600]} !important;
              }

              &:active {
                background-color: ${colors.red[300]} !important;
                color: ${colors.red[700]} !important;
                -webkit-text-fill-color: ${colors.red[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.red[500]};
              -webkit-text-fill-color: ${colors.red[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.red.a1} !important;
                color: ${colors.red[600]} !important;
                -webkit-text-fill-color: ${colors.red[600]} !important;
              }

              &:active {
                background-color: ${colors.red.a2} !important;
                color: ${colors.red[700]} !important;
                -webkit-text-fill-color: ${colors.red[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.red[500]};
              -webkit-text-fill-color: ${colors.red[500]};

              &:hover {
                background-color: ${colors.red.a1} !important;
                color: ${colors.red[600]} !important;
                -webkit-text-fill-color: ${colors.red[600]} !important;
              }

              &:active {
                background-color: ${colors.red.a2} !important;
                color: ${colors.red[700]} !important;
                -webkit-text-fill-color: ${colors.red[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.red[500]};
              -webkit-text-fill-color: ${colors.red[500]};

              &:hover {
                color: ${colors.red[600]} !important;
                -webkit-text-fill-color: ${colors.red[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.red[700]} !important;
                -webkit-text-fill-color: ${colors.red[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.red[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.red[600]} !important;
              }

              &:active {
                background-color: ${colors.red[700]} !important;
              }
            `;
        }
      case 'gray':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.gray[500]};
              -webkit-text-fill-color: ${colors.gray[500]};

              &:hover {
                background-color: ${colors.gray[200]} !important;
                color: ${colors.gray[600]};
                -webkit-text-fill-color: ${colors.gray[600]};
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
                color: ${colors.gray[700]};
                -webkit-text-fill-color: ${colors.gray[700]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.gray[500]};
              -webkit-text-fill-color: ${colors.gray[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray[200]} !important;
                color: ${colors.gray[600]} !important;
                -webkit-text-fill-color: ${colors.gray[600]} !important;
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
                color: ${colors.gray[700]} !important;
                -webkit-text-fill-color: ${colors.gray[700]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.gray[500]};
              -webkit-text-fill-color: ${colors.gray[500]};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray.a1} !important;
                color: ${colors.gray[600]} !important;
                -webkit-text-fill-color: ${colors.gray[600]} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
                color: ${colors.gray[700]} !important;
                -webkit-text-fill-color: ${colors.gray[700]} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.gray[500]};
              -webkit-text-fill-color: ${colors.gray[500]};

              &:hover {
                background-color: ${colors.gray.a1} !important;
                color: ${colors.gray[600]} !important;
                -webkit-text-fill-color: ${colors.gray[600]} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
                color: ${colors.gray[700]} !important;
                -webkit-text-fill-color: ${colors.gray[700]} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.gray[500]};
              -webkit-text-fill-color: ${colors.gray[500]};

              &:hover {
                color: ${colors.gray[600]} !important;
                -webkit-text-fill-color: ${colors.gray[600]} !important;
                text-decoration: underline;
              }

              &:active {
                color: ${colors.gray[700]} !important;
                -webkit-text-fill-color: ${colors.gray[700]} !important;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.gray[500]};
              color: ${colors.light.base};
              -webkit-text-fill-color: ${colors.light.base};

              &:hover {
                background-color: ${colors.gray[600]} !important;
              }

              &:active {
                background-color: ${colors.gray[700]} !important;
              }
            `;
        }
      case 'white':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};

              &:hover {
                background-color: ${colors.gray[200]} !important;
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};
              border: 1px solid ${colors.white};

              &:hover {
                background-color: ${colors.gray[200]} !important;
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.white};
              -webkit-text-fill-color: ${colors.white};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray.a1} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.white};
              -webkit-text-fill-color: ${colors.white};

              &:hover {
                background-color: ${colors.gray.a1} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.white};
              -webkit-text-fill-color: ${colors.white};

              &:hover {
                text-decoration: underline;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.white};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};

              &:hover {
                background-color: ${colors.gray[100]} !important;
              }

              &:active {
                background-color: ${colors.gray[200]} !important;
              }
            `;
        }
      case 'black':
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};

              &:hover {
                background-color: ${colors.gray[200]} !important;
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.gray[100]};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray[200]} !important;
              }

              &:active {
                background-color: ${colors.gray[300]} !important;
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray.a1} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};

              &:hover {
                background-color: ${colors.gray.a1} !important;
              }

              &:active {
                background-color: ${colors.gray.a2} !important;
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: ${colors.black};
              -webkit-text-fill-color: ${colors.black};

              &:hover {
                text-decoration: underline;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.black};
              color: ${colors.white};
              -webkit-text-fill-color: ${colors.white};

              &:hover {
                background-color: ${colors.gray[700]} !important;
              }

              &:active {
                background-color: ${colors.gray[600]} !important;
              }
            `;
        }
      default:
        switch (props.$variant) {
          case 'soft':
            return css`
              background-color: ${colors.gray[100]};
              color: inherit;

              &:hover {
                background-color: ${colors.gray[200]};
              }

              &:active {
                background-color: ${colors.gray[300]};
              }
            `;
          case 'surface':
            return css`
              background-color: ${colors.gray[100]};
              color: inherit;
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray[200]};
              }

              &:active {
                background-color: ${colors.gray[300]};
              }
            `;
          case 'outline':
            return css`
              background-color: ${colors.clear};
              color: inherit;
              border: 1px solid currentColor;

              &:hover {
                background-color: ${colors.gray.a1};
              }

              &:active {
                background-color: ${colors.gray.a2};
              }
            `;
          case 'ghost':
            return css`
              background-color: ${colors.clear};
              color: inherit;
              -webkit-text-fill-color: inherit;

              &:hover {
                background-color: ${colors.gray.a1};
              }

              &:active {
                background-color: ${colors.gray.a2};
              }
            `;
          case 'link':
            return css`
              padding: 0;

              background-color: ${colors.clear};
              color: inherit;

              &:hover {
                text-decoration: underline;
              }
            `;
          case 'solid':
          default:
            return css`
              background-color: ${colors.background.secondary};
              color: inherit;

              &:hover {
                background-color: ${colors.gray.a1};
              }

              &:active {
                background-color: ${colors.gray.a2};
              }
            `;
        }
    }
  }};
`;
