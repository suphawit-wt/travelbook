// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  Size,
  TextColor,
  Underline,
  Warp,
  Weight,
} from '@/shared/types/components';

import { type StyledLink } from './link.styled';

import type { ComponentPropsWithoutRef } from 'react';

export interface StyledLinkProps {
  $color?: TextColor;
  $size?: Size;
  $weight?: Weight;
  $warp?: Warp;
  $underline?: Underline;
  $enableHoverColor?: boolean;
}

export type LinkProps = ComponentPropsWithoutRef<typeof StyledLink>;
