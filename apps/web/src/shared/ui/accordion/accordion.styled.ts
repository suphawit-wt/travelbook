// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { mixins } from '@/shared/styles/mixins';
import { colors, spacing } from '@/shared/styles/variables';

export const Title = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;

  /* Box model */

  /* Styling */

  /* Animation */
`;

export const StyledTrigger = styled(Accordion.Trigger)`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}
  flex: 1;

  /* Box model */
  min-height: 45px;
  width: 100%;

  /* Styling */
  background-color: transparent;
  line-height: 1;
  cursor: pointer;
  -webkit-text-fill-color: ${colors.text.base} !important;

  /* Animation */
  & > div > svg {
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
    -webkit-text-fill-color: ${colors.text.base} !important;
  }

  &[data-state='open'] > div > svg {
    transform: rotate(180deg);
  }
`;

export const Header = styled(Accordion.Header)`
  /* Layout */
  all: unset;
  display: flex;

  /* Box model */

  /* Styling */

  /* Animation */
`;

export const Content = styled(Accordion.Content)`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.medium};
  overflow: hidden;

  /* Box model */
  margin: 10px 0;

  /* Styling */

  /* Animation */
  will-change: height;
  transition: height 0.24s cubic-bezier(0, 0, 0.4, 1);

  &[data-state='open'] {
    animation: ${animation.slideDown} 0.24s cubic-bezier(0, 0, 0.4, 1);
  }

  &[data-state='closed'] {
    animation: ${animation.slideUp} 0.24s cubic-bezier(0, 0, 0.4, 1);
  }
`;

export const Item = styled(Accordion.Item)`
  /* Layout */
  overflow: hidden;

  /* Box model */

  /* Styling */

  /* Animation */
`;
