// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { css, styled } from 'styled-components';

import { colors, radius, typography } from '@/shared/styles/variables';

import type { CheckboxProps } from './checkbox.types';

export const Indicator = styled(Checkbox.Indicator)`
  /* Styling */
  color: ${colors.white};
  font-size: ${typography.fontSize.extraSmall};
`;

export const Root = styled(Checkbox.Root)<CheckboxProps>`
  /* Layout */
  all: unset;

  /* Box model */
  border: 1px solid ${colors.text.description};

  /* Styling */
  background-color: ${colors.background.base};
  border-radius: ${radius.small};

  /* Animation */
  transition:
    background-color 0.3s ease,
    border 0.2s ease;

  &:hover {
    cursor: pointer;
  }

  &[data-state='checked'] {
    /* Box model */
    border: 1px solid transparent;
  }

  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          width: 14px;
          height: 14px;
        `;
      case 'md':
        return css`
          width: 17px;
          height: 17px;
        `;
      case 'lg':
        return css`
          width: 20px;
          height: 20px;
        `;
      default:
        return css``;
    }
  }}

  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.indigo[500]};
          }
        `;
      case 'blue':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.blue[500]};
          }
        `;
      case 'green':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.green[500]};
          }
        `;
      case 'yellow':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.yellow[500]};
          }
        `;
      case 'orange':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.orange[500]};
          }
        `;
      case 'red':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.red[500]};
          }
        `;
      case 'gray':
        return css`
          &[data-state='checked'] {
            background-color: ${colors.gray[500]};
          }
        `;
      default:
        return css``;
    }
  }}
`;
