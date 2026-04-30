// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  Align,
  IconColor,
  Size,
  TextColor,
  Underline,
  Warp,
  Weight,
} from '@/shared/types/components';

import { type StyledHeading } from './heading.styled';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface StyledHeadingProps {
  $color?: TextColor;
  $size?: Size;
  $weight?: Weight;
  $align?: Align;
  $warp?: Warp;
  $underline?: Underline;
}

export interface HeadingProps extends ComponentPropsWithoutRef<
  typeof StyledHeading
> {
  as?: HeadingVariant;
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  $iconColor?: IconColor;
  $iconSize?: Size;
}
