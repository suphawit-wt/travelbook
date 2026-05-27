// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, radius, shadow, spacing } from '@/shared/styles/variables';

export const OccupancyContainer = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.medium};

  /* Box model */
  width: 320px;
  padding: 30px;

  /* Styling */
  background-color: ${colors.popover.base};
  border-radius: ${radius.medium};
  box-shadow: ${shadow.large};

  @media ${media.minTablet} {
    width: 340px;
  }

  :focus {
    outline: none;
  }
`;

export const PopoverButton = styled.button`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}

  /* Box model */
  height: 100%;
  min-height: 50px;
  border: 1px solid transparent;

  /* Styling */
  background-color: ${colors.background.base};
  user-select: none;
  border-radius: ${radius.small};
  -webkit-text-fill-color: ${colors.text.base} !important;

  &:hover {
    border: 1px solid ${colors.red[400]};
  }

  & > div:first-child {
    margin-left: 14px;
    -webkit-text-fill-color: ${colors.text.base} !important;
  }

  & > div:last-child {
    margin-right: 14px;
    -webkit-text-fill-color: ${colors.text.base} !important;
  }

  & > div > svg {
    -webkit-text-fill-color: ${colors.text.base} !important;
  }
`;

export const OccupancyItem = styled.div`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}
  flex-direction: row;
  gap: ${spacing.gap.medium};
`;
