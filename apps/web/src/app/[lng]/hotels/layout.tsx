// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { DefaultLayout } from '@/layouts';

import type { FC, PropsWithChildren } from 'react';

const HotelsLayout: FC<PropsWithChildren> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default HotelsLayout;
