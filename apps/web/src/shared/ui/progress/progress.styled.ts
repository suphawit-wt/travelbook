// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Progress from '@radix-ui/react-progress';
import { css, styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

import type { ProgressIndicatorProps } from './progress.types';

export const Root = styled(Progress.Root)`
  /* Layout */
  position: relative;
  overflow: hidden;

  /* Box model */
  width: 100%;
  height: 8px;

  /* Styling */
  background: ${colors.gray[300]};
  border-radius: ${radius.full};

  /* Animation */
  transform: translateZ(0);
`;

export const Indicator = styled(Progress.Indicator)<ProgressIndicatorProps>`
  /* Layout */

  /* Box model */
  width: 100%;
  height: 100%;

  /* Animation */
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);

  ${(props) => {
    switch (props.$color) {
      case 'indigo':
        return css`
          background-color: ${colors.indigo[700]};
        `;
      case 'blue':
        return css`
          background-color: ${colors.blue[700]};
        `;
      case 'green':
        return css`
          background-color: ${colors.green[700]};
        `;
      case 'red':
        return css`
          background-color: ${colors.red[700]};
        `;
      case 'orange':
        return css`
          background-color: ${colors.orange[700]};
        `;
      case 'yellow':
        return css`
          background-color: ${colors.yellow[700]};
        `;
      case 'gray':
        return css`
          background-color: ${colors.gray[700]};
        `;
      default:
        return css``;
    }
  }}
`;
