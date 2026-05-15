// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Container } from '@/shared/ui';

import { HeaderBar } from './header-bar/header-bar';
import { Wrapper } from './header.styled';
import { SiteNav } from './site-nav/site-nav';

import type { HeaderProps } from './header.types';
import type { FC } from 'react';

export const Header: FC<HeaderProps> = ({ showSiteNav = false }) => {
  return (
    <Wrapper>
      <Container>
        <HeaderBar />
        {showSiteNav ? <SiteNav /> : null}
      </Container>
    </Wrapper>
  );
};
