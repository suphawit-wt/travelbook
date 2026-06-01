// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, typography } from '@/shared/styles/variables';

import type { TabsRootProps } from './tabs.types';

export const Trigger = styled(Tabs.Trigger)``;

export const List = styled(Tabs.List)`
  margin-bottom: 20px;
`;

export const Root = styled(Tabs.Root)<TabsRootProps>`
  ${(props) => {
    switch (props.$variant) {
      case 'tabs':
        return css`
          & > ${List} {
            display: grid;
            grid-template-columns: repeat(6, 1fr);

            & > ${Trigger} {
              width: 100%;
              height: 55px;
              border-radius: 0;
              font-size: ${typography.fontSize.small};
              border-bottom: 1px solid ${colors.separator};

              &[data-state='active'] {
                border-bottom: 2px solid ${colors.blue[500]};
              }
            }
          }
        `;
      case 'button':
        return css`
          & > ${List} {
            /* Layout */
            ${mixins.display.flex.flexItemCenterWithGap}
            overflow-x: auto;

            /* Box model */
            margin-bottom: 20px;

            & > ${Trigger} {
              /* Layout */
              flex-shrink: 0;

              &[data-state='active'] {
                background-color: ${colors.blue[100]};
                color: ${colors.blue[500]};
                border: 1px solid currentColor;

                &:hover {
                  background-color: ${colors.blue[200]} !important;
                  color: ${colors.blue[600]} !important;
                }

                &:active {
                  background-color: ${colors.blue[300]} !important;
                  color: ${colors.blue[700]} !important;
                }
              }
            }
          }
        `;
      default:
        return css``;
    }
  }}
`;
