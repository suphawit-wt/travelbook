// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { mixins } from '@/shared/styles/mixins';
import {
  colors,
  radius,
  shadow,
  typography,
  zIndex,
} from '@/shared/styles/variables';

export const Content = styled(Dropdown.Content)`
  /* Layout */
  z-index: ${zIndex.dropdown};

  /* Box model */
  min-width: 220px;
  padding: 5px 0;

  /* Styling */
  background-color: ${colors.background.base};
  border-radius: ${radius.large};
  box-shadow: ${shadow.medium};

  /* Animation */
  animation-duration: 700ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.1, 1);
  will-change: transform, opacity;

  &[data-side='top'] {
    &[data-state='open'] {
      animation-name: ${animation.slideDownAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideDownAndFadeOut};
    }
  }

  &[data-side='bottom'] {
    &[data-state='open'] {
      animation-name: ${animation.slideUpAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideUpAndFadeOut};
    }
  }

  &[data-side='left'] {
    &[data-state='open'] {
      animation-name: ${animation.slideRightAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideRightAndFadeOut};
    }
  }

  &[data-side='right'] {
    &[data-state='open'] {
      animation-name: ${animation.slideLeftAndFadeIn};
    }

    &[data-state='closed'] {
      animation-name: ${animation.slideLeftAndFadeOut};
    }
  }
`;

export const Item = styled(Dropdown.Item)`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}
  position: relative;
  user-select: none;

  /* Box model */
  width: 100%;
  padding: 14px 18px;

  /* Styling */
  outline: none;

  &[data-disabled] {
    color: ${colors.gray[400]};
    pointer-events: none;
  }

  &[data-highlighted] {
    background-color: ${colors.overlay.base};
  }
`;

export const Label = styled(Dropdown.Label)`
  /* Box model */
  padding-left: 25px;

  /* Styling */
  font-size: ${typography.fontSize.extraSmall};
`;

export const Arrow = styled(Dropdown.Arrow)`
  /* Styling */
  fill: ${colors.background.base};
`;

export const Separator = styled(Dropdown.Separator)`
  /* Box model */
  height: 1px;
  margin: 5px;

  /* Styling */
  background-color: ${colors.separator};
`;

export const ItemIndicator = styled(Dropdown.ItemIndicator)`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  /* Box model */
  left: 0;
  width: 25px;
`;
