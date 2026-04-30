// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  Align,
  Size,
  TextColor,
  Warp,
  Weight,
} from '@/shared/types/components';

export interface StyledLabelProps {
  $color?: TextColor;
  $size?: Size;
  $weight?: Weight;
  $align?: Align;
  $warp?: Warp;
}
