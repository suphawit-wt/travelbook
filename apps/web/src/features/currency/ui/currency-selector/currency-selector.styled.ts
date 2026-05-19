// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { typography } from '@/shared/styles/variables';
import { Button, Dialog } from '@/shared/ui';

export const ButtonWrapper = styled(Button)`
  background-color: transparent;
  font-size: ${typography.fontSize.small};

  span {
    ${mixins.display.flex.flexItemCenterWithGap}
  }
`;

export const DialogContent = styled(Dialog.Content)`
  @media ${media.minLaptop} {
    /* Box model */
    padding: 25px;
  }
`;
