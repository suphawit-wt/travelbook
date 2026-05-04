// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { BaseSize, RadiusPosition } from '@/shared/types/components';

export interface CardRootProps {
  $variant?: 'surface' | 'classic' | 'ghost';
  $padding?: BaseSize | 'xl' | 'xs';
}

export interface CardContentProps {
  $padding?: BaseSize | 'xl' | 'xs';
}

export interface CardImageContainerProps {
  $radiusPosition?: RadiusPosition;
}
