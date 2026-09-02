// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { LucideIcon } from 'lucide-react';

export interface FacilitiesProps {
  propertyName: string;
}

export interface FacilitiesGroup {
  icon: LucideIcon;
  title: string;
  items?: string[];
  description?: string;
}
