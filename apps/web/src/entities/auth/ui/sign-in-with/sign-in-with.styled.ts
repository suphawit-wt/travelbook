// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { colors, radius } from '@/shared/styles/variables';
import { styled } from 'styled-components';

export const SignInWithButton = styled.button`
  /* Box model */
  padding: 20px 22px;
  border: 1px solid ${colors.separator};

  /* Styling */
  background-color: ${colors.background.base};
  border-radius: ${radius.small};

  &:hover {
    border: 1px solid ${colors.blue[500]};
  }
`;
