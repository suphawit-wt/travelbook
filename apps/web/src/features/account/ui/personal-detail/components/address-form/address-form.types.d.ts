// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { AddressResponse } from '@/features/user/lib/user.service.types';

import type { FormProps } from '../../personal-detail.types';

export interface AddressFormProps extends FormProps {
  address: AddressResponse | null;
}
