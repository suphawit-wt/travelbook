// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { AlertCircle } from 'lucide-react';
import { forwardRef } from 'react';

import { Icon } from '../icon';
import { Text } from '../text';
import { Tooltip } from '../tooltip';

import { InputGroup, InputStyled } from './input.styled';

import type { InputProps } from './input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errorDisplay = 'below-input', errorMessage, icon, ...props }, ref) => {
    return (
      <>
        <InputGroup $isError={Boolean(props.$isError)}>
          {icon ? (
            <Tooltip
              showArrow
              align="start"
              content={errorMessage}
              delayDuration={0}
              isError={Boolean(props.$isError)}
              open={Boolean(props.$isError)}
              side="bottom"
            >
              <Icon icon={icon} />
            </Tooltip>
          ) : null}
          <InputStyled {...props} ref={ref} />
          {props.$isError && errorDisplay === 'below-input' ? (
            <Icon $color="red" icon={AlertCircle} />
          ) : null}
        </InputGroup>
        {errorDisplay === 'below-input' ? (
          <Text $color="red" $size="sm">
            {errorMessage}
          </Text>
        ) : null}
      </>
    );
  },
);

Input.displayName = 'Input';
