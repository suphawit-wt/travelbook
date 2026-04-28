// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { css } from 'styled-components';

import type {
  Align,
  BaseColor,
  Shadow,
  Size,
  TextColor,
  Underline,
  Weight,
} from '@/shared/types/components';

import { media } from '../breakpoints';
import { colors, typography } from '../variables';

interface FontSizeProps {
  $size?: Size;
}

export const fontSize = css<FontSizeProps>`
  ${(props) => {
    switch (props.$size) {
      case 'xs':
        return css`
          font-size: ${typography.fontSize.extraSmall};
        `;
      case 'sm':
        return css`
          font-size: ${typography.fontSize.small};
        `;
      case 'md':
        return css`
          font-size: ${typography.fontSize.medium};
        `;
      case 'lg':
        return css`
          font-size: ${typography.fontSize.large};
        `;
      case 'xl':
        return css`
          font-size: ${typography.fontSize.extraLarge};
        `;
      case '2xl':
        return css`
          font-size: ${typography.fontSize.extraLarge};

          @media ${media.minDesktop} {
            font-size: ${typography.fontSize.extraLarge2};
          }
        `;
      case '3xl':
        return css`
          font-size: ${typography.fontSize.extraLarge2};

          @media ${media.minDesktop} {
            font-size: ${typography.fontSize.extraLarge3};
          }
        `;
      case '4xl':
        return css`
          font-size: ${typography.fontSize.extraLarge3};

          @media ${media.minDesktop} {
            font-size: ${typography.fontSize.extraLarge4};
          }
        `;
      case '5xl':
        return css`
          font-size: ${typography.fontSize.extraLarge4};

          @media ${media.minDesktop} {
            font-size: ${typography.fontSize.extraLarge5};
          }
        `;
      case '6xl':
        return css`
          font-size: ${typography.fontSize.extraLarge5};

          @media ${media.minDesktop} {
            font-size: ${typography.fontSize.extraLarge6};
          }
        `;
      default:
        return css`
          font-size: inherit;
        `;
    }
  }};
`;

interface FontWeightProps {
  $weight?: Weight;
}

export const fontWeight = css<FontWeightProps>`
  ${(props) => {
    switch (props.$weight) {
      case 'light':
        return css`
          font-weight: ${typography.fontWeight.light};
        `;
      case 'normal':
        return css`
          font-weight: ${typography.fontWeight.normal};
        `;
      case 'medium':
        return css`
          font-weight: ${typography.fontWeight.medium};
        `;
      case 'semibold':
        return css`
          font-weight: ${typography.fontWeight.semiBold};
        `;
      case 'bold':
        return css`
          font-weight: ${typography.fontWeight.bold};
        `;
      case 'extrabold':
        return css`
          font-weight: ${typography.fontWeight.extraBold};
        `;
      case 'black':
        return css`
          font-weight: ${typography.fontWeight.black};
        `;
      default:
        return css``;
    }
  }};
`;

interface FontBaseColorProps {
  $color?: BaseColor;
}

export const fontBaseColor = css<FontBaseColorProps>`
  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        return css`
          color: ${colors.indigo[500]};
          -webkit-text-fill-color: ${colors.indigo[500]} !important;
        `;
      case 'blue':
        return css`
          color: ${colors.blue[500]};
          -webkit-text-fill-color: ${colors.blue[500]} !important;
        `;
      case 'green':
        return css`
          color: ${colors.green[500]};
          -webkit-text-fill-color: ${colors.green[500]} !important;
        `;
      case 'yellow':
        return css`
          color: ${colors.yellow[500]};
          -webkit-text-fill-color: ${colors.yellow[500]} !important;
        `;
      case 'orange':
        return css`
          color: ${colors.orange[500]};
          -webkit-text-fill-color: ${colors.orange[500]} !important;
        `;
      case 'red':
        return css`
          color: ${colors.red[500]};
          -webkit-text-fill-color: ${colors.red[500]} !important;
        `;
      case 'gray':
        return css`
          color: ${colors.gray[500]};
          -webkit-text-fill-color: ${colors.gray[500]} !important;
        `;
      case 'white':
        return css`
          color: ${colors.white};
          -webkit-text-fill-color: ${colors.white} !important;
        `;
      case 'black':
        return css`
          color: ${colors.black};
          -webkit-text-fill-color: ${colors.black} !important;
        `;
      default:
        return css``;
    }
  }};
`;

interface FontColorProps {
  $color?: TextColor;
}

export const fontColor = css<FontColorProps>`
  ${(props) => {
    switch (props.$color) {
      case 'description':
        return css`
          color: ${colors.text.description};
          -webkit-text-fill-color: ${colors.text.description};
        `;
      case 'indigo':
        return css`
          color: ${colors.indigo[500]};
          -webkit-text-fill-color: ${colors.indigo[500]} !important;
        `;
      case 'blue':
        return css`
          color: ${colors.blue[500]};
          -webkit-text-fill-color: ${colors.blue[500]} !important;
        `;
      case 'green':
        return css`
          color: ${colors.green[500]};
          -webkit-text-fill-color: ${colors.green[500]} !important;
        `;
      case 'yellow':
        return css`
          color: ${colors.yellow[500]};
          -webkit-text-fill-color: ${colors.yellow[500]} !important;
        `;
      case 'orange':
        return css`
          color: ${colors.orange[500]};
          -webkit-text-fill-color: ${colors.orange[500]} !important;
        `;
      case 'red':
        return css`
          color: ${colors.red[500]};
          -webkit-text-fill-color: ${colors.red[500]} !important;
        `;
      case 'gray':
        return css`
          color: ${colors.gray[500]};
          -webkit-text-fill-color: ${colors.gray[500]} !important;
        `;
      case 'white':
        return css`
          color: ${colors.white};
          -webkit-text-fill-color: ${colors.white} !important;
        `;
      case 'black':
        return css`
          color: ${colors.black};
          -webkit-text-fill-color: ${colors.black} !important;
        `;
      default:
        return css`
          color: inherit;
        `;
    }
  }};
`;

interface LinkColorProps {
  $color?: TextColor;
  $enableHoverColor?: boolean;
}

export const linkColor = css<LinkColorProps>`
  ${(props) => {
    switch (props.$color) {
      case 'description':
        return css`
          color: ${colors.text.description};
        `;
      case 'indigo':
        return css`
          color: ${colors.indigo[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.indigo[700]};
              }

              &:active {
                color: ${colors.indigo[900]};
              }
            `
          }
        `;
      case 'blue':
        return css`
          color: ${colors.blue[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.blue[700]};
              }

              &:active {
                color: ${colors.blue[900]};
              }
            `
          }
        `;
      case 'green':
        return css`
          color: ${colors.green[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.green[700]};
              }

              &:active {
                color: ${colors.green[900]};
              }
            `
          }
        `;
      case 'yellow':
        return css`
          color: ${colors.yellow[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.yellow[700]};
              }

              &:active {
                color: ${colors.yellow[900]};
              }
            `
          }
        `;
      case 'orange':
        return css`
          color: ${colors.orange[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.orange[700]};
              }

              &:active {
                color: ${colors.orange[900]};
              }
            `
          }
        `;
      case 'red':
        return css`
          color: ${colors.red[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.red[700]};
              }

              &:active {
                color: ${colors.red[900]};
              }
            `
          }
        `;
      case 'gray':
        return css`
          color: ${colors.gray[500]};

          ${
            props.$enableHoverColor &&
            css`
              &:hover {
                color: ${colors.gray[700]};
              }

              &:active {
                color: ${colors.gray[900]};
              }
            `
          }
        `;
      case 'white':
        return css`
          color: ${colors.white};
        `;
      case 'black':
        return css`
          color: ${colors.black};
        `;
      default:
        return css`
          color: inherit;
        `;
    }
  }};
`;

interface TextShadowProps {
  $shadow?: Shadow;
}

export const textShadow = css<TextShadowProps>`
  ${(props) => {
    switch (props.$shadow) {
      case 'sm':
        return css`
          text-shadow: 0px 1px 3px hsla(0, 0%, 0%, 0.35);
        `;
      case 'md':
        return css`
          text-shadow: 0px 1px 3px hsla(0, 0%, 0%, 0.65);
        `;
      case 'lg':
        return css`
          text-shadow: 0px 1px 3px hsla(0, 0%, 0%, 0.85);
        `;
      default:
        return css``;
    }
  }};
`;

interface TextAlignProps {
  $align?: Align;
}

export const textAlign = css<TextAlignProps>`
  ${(props) => {
    switch (props.$align) {
      case 'center':
        return css`
          text-align: center;
        `;
      case 'right':
        return css`
          text-align: right;
        `;
      case 'left':
      default:
        return css`
          text-align: left;
        `;
    }
  }};
`;

interface TextUnderlineProps {
  $underline?: Underline;
}

export const textUnderline = css<TextUnderlineProps>`
  ${(props) => {
    switch (props.$underline) {
      case 'always':
        return css`
          text-decoration: underline;
        `;
      case 'hover':
        return css`
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        `;
      default:
        return css`
          text-decoration: none;
        `;
    }
  }};
`;
