// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  Align,
  IconColor,
  Shadow,
  Size,
  TextColor,
  TextSize,
  Underline,
  Warp,
  Weight,
} from '@/shared/types/components';

import { type StyledText } from './text.styled';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

type TextVariant = 'span' | 'div' | 'p';

export interface StyledTextProps {
  $color?: TextColor;
  $size?: TextSize;
  $weight?: Weight;
  $align?: Align;
  $warp?: Warp;
  $shadow?: Shadow;
  $underline?: Underline;
}

export interface TextProps extends ComponentPropsWithoutRef<typeof StyledText> {
  as?: TextVariant;
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  $iconColor?: IconColor;
  $iconSize?: Size;
}
