// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

import type { SelectProps } from './select.types';

export const Wrapper = styled.div`
  isolation: isolate;
  position: relative;

  & > span {
    display: flex;
    align-items: center;

    position: absolute;
    inset-inline-end: 8px;
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const Root = styled.select<SelectProps>`
  /* Box model */
  appearance: none;
  width: 100%;
  min-height: 36px;
  padding: 3px;
  padding-inline-end: 36px;
  padding-inline-start: 8px;
  box-sizing: border-box;

  /* Styling */
  text-overflow: ellipsis;
  background-color: ${colors.background.base};
  border-radius: ${radius.small};
  border-color: ${colors.gray[500]};

  &:focus {
    outline: none;
  }

  &:invalid {
    color: ${colors.text.description};
  }
`;

export const Option = styled.option``;
