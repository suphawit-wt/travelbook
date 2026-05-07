// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { media } from '@/shared/styles/breakpoints';
import {
  colors,
  radius,
  shadow,
  typography,
  zIndex,
} from '@/shared/styles/variables';

export const Overlay = styled(Dialog.Overlay)`
  /* Layout */
  position: fixed;
  inset: 0;
  z-index: ${zIndex.modal.backdrop};

  /* Styling */
  background-color: ${colors.dialog.overlay};

  /* Animation */
  animation: ${animation.fadeIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity;
`;

export const Content = styled(Dialog.Content)`
  /* Layout */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${zIndex.modal.content};
  overflow: auto;

  /* Box model */
  height: 100%;

  /* Styling */
  background-color: ${colors.background.base};
  box-shadow: ${shadow.large};

  /* Animation */
  animation: ${animation.fadeInAndPopup} 300ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity;

  @media ${media.minLaptop} {
    /* Box model */
    height: initial;
    max-width: 980px;
    max-height: 85vh;

    /* Styling */
    border-radius: ${radius.extraLarge};
  }

  @media ${media.maxLaptop} {
    width: 100%;

    & > h4 {
      margin: 0 20px;
    }
  }

  &:focus {
    outline: none;
  }
`;

export const Title = styled(Dialog.Title)`
  /* Box model */
  margin-bottom: 10px;

  /* Styling */
  color: ${colors.text.base};
  font-size: ${typography.fontSize.extraLarge};
  font-weight: ${typography.fontWeight.bold};

  @media ${media.maxLaptop} {
    margin: 60px 20px 10px 20px;
  }
`;

export const Description = styled(Dialog.Description)`
  /* Box model */
  margin-bottom: 15px;

  /* Styling */
  color: ${colors.text.description};
  font-size: ${typography.fontSize.small};
  line-height: 1.5;

  @media ${media.maxLaptop} {
    margin-left: 20px;
    margin-right: 20px;
  }
`;
