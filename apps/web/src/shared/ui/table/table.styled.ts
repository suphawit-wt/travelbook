// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, typography } from '@/shared/styles/variables';

export const HeaderCell = styled.th`
  vertical-align: top;
  text-align: left;
  padding: 8px 10px;
`;

export const Cell = styled.td`
  vertical-align: top;
  text-align: left;
  padding: 8px 10px;

  & > select {
    width: 3.5em;
  }
`;

export const Row = styled.tr`
  border-bottom: 3px solid ${colors.blue[300]};
`;

export const Header = styled.thead`
  & > ${Row} > th {
    height: 52px;
    white-space: nowrap;
    font-size: ${typography.fontSize.small};
    color: ${colors.white};
    background-color: ${colors.indigo[400]};
    border-left: 1px solid ${colors.blue[300]};
  }
`;

export const Body = styled.tbody`
  & > ${Row} > ${Cell} {
    border: 1px solid ${colors.blue[200]};
    border-right: 0;
    padding: 8px;
  }
`;

export const Root = styled.table`
  /* Layout */
  width: 100%;
  min-height: 270px;

  /* Box model */

  /* Styling */
  border-bottom: 1px solid ${colors.blue[300]};
  border-collapse: collapse;

  /* Animation */
`;
