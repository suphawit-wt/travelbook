// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { ReactNode } from 'react';

export interface TooltipContentProps {
  $isError?: boolean;
}

export interface TooltipArrowProps {
  $isError?: boolean;
}

export interface TooltipProps {
  content: ReactNode;
  delayDuration?: number;
  open?: boolean;
  align?: 'center' | 'end' | 'start';
  side?: 'left' | 'right' | 'bottom' | 'top';
  showArrow?: boolean;
  sideOffset?: number;
  isError?: boolean;
}
