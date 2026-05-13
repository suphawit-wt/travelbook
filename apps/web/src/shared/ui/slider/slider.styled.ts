// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Slider from '@radix-ui/react-slider';
import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const StyledRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 20px;
`;

export const Track = styled(Slider.Track)`
  background-color: ${colors.blue[300]};
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
`;

export const Range = styled(Slider.Range)`
  position: absolute;
  background-color: ${colors.blue[500]};
  border-radius: 9999px;
  height: 100%;
`;

export const Thumb = styled(Slider.Thumb)`
  display: block;
  width: 16px;
  height: 16px;
  background-color: ${colors.blue[500]};
  border-radius: 10px;
  outline: none;

  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  will-change: transform, box-shadow;

  &:hover {
    cursor: grab;
    background-color: ${colors.blue[600]};
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.2);
    box-shadow: 0 0 0 8px ${colors.blue.a2};
  }
`;
