// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Check } from 'lucide-react';
import { forwardRef } from 'react';

import { Indicator, Root } from './checkbox.styled';

import type { CheckboxProps } from './checkbox.types';

type CheckboxElement = React.ElementRef<typeof Root>;

export const Checkbox = forwardRef<CheckboxElement, CheckboxProps>(
  ({ $color = 'blue', $size = 'md', ...props }, ref) => {
    return (
      <div style={{ display: 'inline-flex' }}>
        <Root {...props} ref={ref} $color={$color} $size={$size}>
          <Indicator>
            <Check size={16} />
          </Indicator>
        </Root>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
