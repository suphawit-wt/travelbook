// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { EditMode } from '../../personal-detail.types';

export interface NameFormProps {
  firstName: string | null;
  lastName: string | null;
  editActive: EditMode;
  setEditActive: (mode: EditMode) => void;
}
