// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Range } from 'react-date-range';

export interface MobileDateRangePickerProps {
  value: Range;
  onChange: (range: Range) => void;
  minDate?: Date;
  months?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
