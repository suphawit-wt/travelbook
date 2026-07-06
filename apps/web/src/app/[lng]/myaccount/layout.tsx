// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Header } from '@/widgets/header';
import { SimpleFooter } from '@/widgets/simple-footer';

import type { FC, PropsWithChildren } from 'react';

const MyAccountLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <SimpleFooter />
    </>
  );
};

export default MyAccountLayout;
