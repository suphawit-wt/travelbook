// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyItem } from '@/features/property/lib/property.service.types';
import type { Breakpoint } from '@/shared/types/components';

export interface HomesGuestsLoveWrapperProps {
  $showOnly?: Breakpoint;
}

export interface HomesGuestsLoveProps {
  properties: PropertyItem[];
}
