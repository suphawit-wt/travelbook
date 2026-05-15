// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { LucideIcon } from 'lucide-react';

type NavDialogVariant = 'default' | 'auth';

export interface NavDialogProps {
  variant?: NavDialogVariant;
}

interface NavLink {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
}

interface NavSection {
  id: string;
  title: string;
  links: NavLink[];
}
