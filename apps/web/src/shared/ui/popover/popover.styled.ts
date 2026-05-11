// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Popover from '@radix-ui/react-popover';
import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { zIndex } from '@/shared/styles/variables';

export const Content = styled(Popover.Content)`
  /* Layout */
  z-index: ${zIndex.dropdown};

  /* Box model */
  padding: 0px;

  /* Styling */

  /* Animation */
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
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
