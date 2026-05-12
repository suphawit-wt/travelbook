// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, radius, spacing, typography } from '@/shared/styles/variables';

export const Root = styled(RadioGroup.Root)`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}

  /* Box model */
  padding: 3px;
  background-color: ${colors.background.secondary};
  border-radius: ${radius.full};
  border: 1px solid ${colors.separator};

  @media ${media.minLaptop} {
    gap: ${spacing.gap.extraSmall};
  }
`;

export const Item = styled(RadioGroup.Item)`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}
  gap: ${spacing.gap.medium};

  /* Box model */
  padding: 20px;

  font-size: ${typography.fontSize.small};
  font-weight: ${typography.fontWeight.light};

  /* Styling */
  background-color: ${colors.background.secondary};

  @media ${media.minLaptop} {
    /* Box model */
    padding: 4px 12px;

    /* Styling */
    border-radius: ${radius.full};
  }

  &[data-state='checked'] {
    /* Styling */
    color: ${colors.text.base};
    background-color: ${colors.background.base};
    border: 1px solid ${colors.text.base};
  }

  &:not([data-state='checked']):hover {
    /* Styling */
    background-color: ${colors.overlay.base};
  }
`;
