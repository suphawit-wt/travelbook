// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { IconColor, Size } from '@/shared/types/components';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

export interface StyledIconProps {
  $color?: IconColor;
  $size?: Size;
}

export interface IconProps
  extends ComponentPropsWithoutRef<LucideIcon>, StyledIconProps {
  icon: LucideIcon;
}
