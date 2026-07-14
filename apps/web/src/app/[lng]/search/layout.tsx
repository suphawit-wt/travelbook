// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import type { FC, PropsWithChildren } from 'react';

const SearchLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header showSiteNav />
      {children}
      <Footer />
    </>
  );
};

export default SearchLayout;
