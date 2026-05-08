// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';
import { Drawer } from 'vaul';

import { animation } from '@/shared/styles/animations';
import { media } from '@/shared/styles/breakpoints';
import { colors, typography, zIndex } from '@/shared/styles/variables';

export const Overlay = styled(Drawer.Overlay)`
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

export const Content = styled(Drawer.Content)`
  /* Layout */
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.modal.content};

  /* Box model */
  height: 100%;
  max-height: fit-content;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  /* Styling */
  background-color: ${colors.background.base};
`;

export const Title = styled(Drawer.Title)`
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

export const Description = styled(Drawer.Description)`
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
