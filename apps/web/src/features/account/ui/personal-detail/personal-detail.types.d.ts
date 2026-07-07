// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
}

export interface AccountMenuItemProps {
  $isActive?: boolean;
}

export type EditMode =
  | 'none'
  | 'name'
  | 'display_name'
  | 'email'
  | 'phone'
  | 'dob'
  | 'nationality'
  | 'gender'
  | 'address'
  | 'passport';

export interface FormProps {
  editActive: EditMode;
  setEditActive: (mode: EditMode) => void;
}
