// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { colors, radius } from '@/shared/styles/variables';

export const Content = styled(HoverCard.Content)`
  /* Layout */

  /* Box model */
  padding: 16px;
  min-width: 300px;
  border-radius: ${radius.medium};

  /* Styling */
  background-color: ${colors.background.base};
  box-shadow: 0px 1px 8px -4px ${colors.shadow.card};

  /* Animation */
  will-change: transform, opacity;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);

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

export const Arrow = styled(HoverCard.Arrow)`
  /* Layout */

  /* Box model */

  /* Styling */
  fill: ${colors.background.base};
  filter: drop-shadow(1px 2px 1px ${colors.shadow.cardArrow});

  /* Animation */
`;
