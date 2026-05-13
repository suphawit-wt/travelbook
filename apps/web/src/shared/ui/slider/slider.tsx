// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Range, StyledRoot, Thumb, Track } from './slider.styled';

import type { SliderProps } from './slider.types';
import type { FC } from 'react';

export const Slider: FC<SliderProps> = (props) => {
  return (
    <StyledRoot {...props}>
      <Track>
        <Range />
      </Track>
      <Thumb aria-label="Volume" />
      <Thumb aria-label="Volume" />
    </StyledRoot>
  );
};
