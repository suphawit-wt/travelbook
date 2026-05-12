// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const Root = styled(RadioGroup.Root)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Item = styled(RadioGroup.Item)`
  all: unset;
  background-color: ${colors.background.base};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid ${colors.text.description};
  cursor: pointer;

  &[data-state='checked'] {
    border: 2px solid ${colors.blue[500]};
  }
`;

export const Indicator = styled(RadioGroup.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${colors.blue[500]};
  }
`;
