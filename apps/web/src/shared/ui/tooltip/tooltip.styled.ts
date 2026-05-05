// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { css, styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { media } from '@/shared/styles/breakpoints';
import {
  colors,
  radius,
  shadow,
  typography,
  zIndex,
} from '@/shared/styles/variables';

import type { TooltipArrowProps, TooltipContentProps } from './tooltip.types';

export const Arrow = styled(Tooltip.Arrow)<TooltipArrowProps>`
  fill: ${colors.tooltip};

  ${(props) =>
    props.$isError &&
    css`
      fill: ${colors.red[700]};
    `}
`;

export const Content = styled(Tooltip.Content)<TooltipContentProps>`
  /* Layout */
  z-index: ${zIndex.tooltip};

  /* Box model */
  padding: 8px 12px;

  /* Styling */
  background-color: ${colors.tooltip};
  color: ${colors.white};
  font-size: ${typography.fontSize.medium};
  line-height: 1;
  user-select: none;
  border-radius: ${radius.small};
  box-shadow: ${shadow.small};

  /* Animation */
  animation-duration: 700ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  @media ${media.maxLaptop} {
    display: none;
  }

  ${(props) =>
    props.$isError &&
    css`
      background-color: ${colors.red[700]};
      font-size: ${typography.fontSize.small};
    `}

  &[data-side='top'] {
    &[data-state='delayed-open'] {
      animation-name: ${animation.slideDownAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideDownAndFadeOut};
    }
  }

  &[data-side='bottom'] {
    &[data-state='delayed-open'] {
      animation-name: ${animation.slideUpAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideUpAndFadeOut};
    }
  }

  &[data-side='left'] {
    &[data-state='delayed-open'] {
      animation-name: ${animation.slideRightAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideRightAndFadeOut};
    }
  }

  &[data-side='right'] {
    &[data-state='delayed-open'] {
      animation-name: ${animation.slideLeftAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideLeftAndFadeOut};
    }
  }
`;
