// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { LucideIcon } from 'lucide-react';

type InputErrorDisplay = 'icon-tooltip' | 'below-input';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  $isError?: boolean;
  errorMessage?: string | undefined;
  icon?: LucideIcon;
  errorDisplay?: InputErrorDisplay;
}
