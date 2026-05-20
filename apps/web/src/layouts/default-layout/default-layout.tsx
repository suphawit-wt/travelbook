// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Footer, Header } from '@/widgets';

import type { FC, PropsWithChildren } from 'react';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header showSiteNav />
      <main>{children}</main>
      <Footer />
    </>
  );
};
