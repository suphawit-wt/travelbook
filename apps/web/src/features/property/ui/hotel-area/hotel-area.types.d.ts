// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { LucideIcon } from 'lucide-react';

export interface NearbyItem {
  id: string;
  name: string;
  distance: string;
  type?: string;
}

export interface NearbyGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  items: NearbyItem[];
}
