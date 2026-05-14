// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Button, NumberDisplay, Wrapper } from './number-input.styled';

import type { NumberInputProps } from './number-input.types';
import type { FC } from 'react';

export const NumberInput: FC<NumberInputProps> = ({
  min = 1,
  max = 30,
  ...props
}) => {
  return (
    <Wrapper>
      <Button
        disabled={props.value <= min}
        tabIndex={-1}
        type="button"
        onClick={props.onDecreaseClick}
      >
        -
      </Button>
      <NumberDisplay id={props.id}>{props.value}</NumberDisplay>
      <Button
        disabled={props.value >= max}
        tabIndex={-1}
        type="button"
        onClick={props.onIncreaseClick}
      >
        +
      </Button>
    </Wrapper>
  );
};
