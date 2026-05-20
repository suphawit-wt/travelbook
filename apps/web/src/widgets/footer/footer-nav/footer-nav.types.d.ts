// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Breakpoint } from '@/shared/types/components';

export interface FooterNavContainerProps {
  $showOnly?: Breakpoint;
}

interface LinkItemType {
  id: number;
  href: string;
  label: string;
}

export interface NavItemsType {
  id: number;
  title: string;
  links: LinkItemType[];
}
