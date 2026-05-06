// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  ButtonVariant,
  Color,
  IconColor,
  IconSize,
  PressEffect,
  Radius,
  Shadow,
} from '@/shared/types/components';

import { type StyledIconButton } from './icon-button.styled';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

export interface StyledIconButtonProps {
  $variant?: ButtonVariant;
  $color?: Color;
  $size?: IconSize;
  $radius?: Radius;
  $shadow?: Shadow;
  $pressEffect?: PressEffect;
}

export interface IconButtonProps extends ComponentPropsWithoutRef<
  typeof StyledIconButton
> {
  icon: LucideIcon;
  $iconColor?: IconColor;
  tooltip?: string;
}
