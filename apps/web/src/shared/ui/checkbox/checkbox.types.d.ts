// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { BaseSize, ColorfulColor } from '@/shared/types/components';

type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onCheckedChange?: (checked: CheckedState) => void;
  defaultChecked?: CheckedState;
  $size?: BaseSize;
  $color?: ColorfulColor;
  checked?: CheckedState;
}
