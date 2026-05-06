// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  ButtonVariant,
  Color,
  PressEffect,
  Radius,
  Shadow,
  Size,
  Underline,
} from '@/shared/types/components';

import { type StyledButton } from './button.styled';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

export interface StyledButtonProps {
  $variant?: ButtonVariant;
  $color?: Color;
  $size?: Size;
  $radius?: Radius;
  $shadow?: Shadow;
  $underline?: Underline;
  $pressEffect?: PressEffect;
}

export interface ButtonProps extends ComponentPropsWithoutRef<
  typeof StyledButton
> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  tooltip?: string;
  loading?: boolean;
  $iconSize?: Size;
}
