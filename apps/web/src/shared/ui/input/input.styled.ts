// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius } from '@/shared/styles/variables';

import type { InputProps } from './input.types';

export const InputGroup = styled.div<InputProps>`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}

  /* Box model */
  border: 1px solid ${colors.gray[500]};

  /* Styling */
  user-select: none;
  border-radius: ${radius.small};

  & > div > svg {
    margin-right: 10px;
  }

  &:focus-within {
    border: 1px solid ${colors.blue[500]};
  }

  ${(props) =>
    props.$isError &&
    css`
      border: 1px solid ${colors.red[500]};
    `}
`;

export const InputStyled = styled.input`
  /* Box model */
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: none;

  /* Styling */
  background-color: ${colors.background.base};
  border-radius: ${radius.small};

  &:focus {
    outline: none;
  }
`;
