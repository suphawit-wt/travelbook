// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Size } from '@/shared/types/components';

export interface SwitchStyledProps {
  $size?: Size;
}

export interface SwitchProps extends SwitchStyledProps {
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
