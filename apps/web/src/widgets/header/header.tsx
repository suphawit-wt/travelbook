// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Container } from '@/shared/ui';

import { HeaderBar } from './header-bar/header-bar';
import { Wrapper } from './header.styled';

import type { FC } from 'react';

export const Header: FC = () => {
  return (
    <Wrapper>
      <Container>
        <HeaderBar />
      </Container>
    </Wrapper>
  );
};
