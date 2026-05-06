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

import { type StyledIconButtonLink } from './icon-button-link.styled';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

export interface StyledIconButtonLinkProps {
  $variant?: ButtonVariant;
  $color?: Color;
  $size?: IconSize;
  $radius?: Radius;
  $shadow?: Shadow;
  $isActive?: boolean;
  $pressEffect?: PressEffect;
}

export interface IconButtonLinkProps extends ComponentPropsWithoutRef<
  typeof StyledIconButtonLink
> {
  icon: LucideIcon;
  $iconColor?: IconColor;
  tooltip?: string;
}
