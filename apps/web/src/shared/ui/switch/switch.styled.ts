// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Switch from '@radix-ui/react-switch';
import { css, styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

import type { SwitchStyledProps } from './switch.types';

export const Thumb = styled(Switch.Thumb)`
  /* Layout */
  display: block;

  /* Box model */
  border: 1px solid ${colors.gray[300]};

  /* Styling */
  background-color: ${colors.white};
  border-radius: ${radius.full};

  /* Animation */
  transition: transform 100ms;
  will-change: transform;

  &[data-state='checked'] {
    /* Box model */
    border: 1px solid ${colors.blue[500]};
  }
`;

export const Root = styled(Switch.Root)<SwitchStyledProps>`
  /* Layout */
  all: unset;
  position: relative;

  /* Box model */
  border: 1px solid ${colors.separator};

  /* Styling */
  background-color: ${colors.background.secondary};
  border-radius: ${radius.full};
  cursor: pointer;

  &[data-state='checked'] {
    /* Box model */
    border: 1px solid ${colors.blue[600]};

    /* Styling */
    background-color: ${colors.blue[500]};
  }

  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          width: 36px;
          height: 20px;

          & > ${Thumb} {
            width: 20px;
            height: 20px;

            &[data-state='checked'] {
              transform: translateX(17px);
            }
          }
        `;
      case 'md':
        return css`
          width: 40px;
          height: 23px;

          & > ${Thumb} {
            width: 23px;
            height: 23px;

            &[data-state='checked'] {
              transform: translateX(18px);
            }
          }
        `;
      case 'lg':
        return css`
          width: 44px;
          height: 25px;

          & > ${Thumb} {
            width: 25px;
            height: 25px;

            &[data-state='checked'] {
              transform: translateX(20px);
            }
          }
        `;
      default:
        return css``;
    }
  }}
`;
