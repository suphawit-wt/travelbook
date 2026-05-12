// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, radius, spacing } from '@/shared/styles/variables';

export const Root = styled(RadioGroup.Root)`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}
  flex-wrap: wrap;

  /* Box model */
  margin-top: 12px;

  @media ${media.minLaptop} {
    gap: ${spacing.gap.medium};
  }
`;

export const Item = styled(RadioGroup.Item)`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}
  gap: ${spacing.gap.medium};

  /* Box model */
  width: 100%;
  padding: 20px;

  /* Styling */
  background-color: ${colors.background.base};
  -webkit-text-fill-color: ${colors.text.base} !important;

  & > div > span {
    -webkit-text-fill-color: ${colors.text.base} !important;
  }

  @media ${media.minLaptop} {
    /* Box model */
    width: 225px;
    padding: 15px;

    /* Styling */
    border-radius: ${radius.small};
  }

  &[data-state='checked'] {
    /* Styling */
    background-color: ${colors.accent};
    color: ${colors.blue[400]};

    & > div > span {
      -webkit-text-fill-color: ${colors.blue[400]} !important;
    }
  }

  &:not([data-state='checked']):hover {
    /* Styling */
    background-color: ${colors.overlay.base};
  }
`;
