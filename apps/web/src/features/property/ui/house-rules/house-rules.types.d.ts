// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyRules } from '@/features/property/lib/property.service.types';

interface CheckInOutRange {
  checkInFrom: string;
  checkInUntil: string;
  checkOutFrom: string;
  checkOutUntil: string;
}

export interface HouseRulesProps {
  propertyName: string;
  rules: PropertyRules;
  checkInOutRange: CheckInOutRange;
}
