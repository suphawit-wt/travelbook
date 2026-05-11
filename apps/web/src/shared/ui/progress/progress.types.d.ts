// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { ColorfulColor } from '@/shared/types/components';

export interface ProgressProps {
  value: number;
  max?: number;
  color?: ColorfulColor;
}

export interface ProgressIndicatorProps {
  $value: number;
  $color?: ColorfulColor;
}
