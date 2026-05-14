// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { InputStatus } from '@/shared/types/input';

type InputMode =
  'numeric' | 'text' | 'decimal' | 'tel' | 'search' | 'email' | 'url';

export interface StyledSlotProps {
  $isActive: boolean;
  $isError: boolean;
  $isSuccess: boolean;
}

export interface InputOTPProps {
  maxLength: number;
  onChange: (newValue: string) => unknown;
  pattern?: string;
  inputMode?: InputMode;
  $isError: boolean;
  $isSuccess: boolean;
  message?: string;
  messageType?: InputStatus;
}
