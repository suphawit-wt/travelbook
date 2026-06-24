// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Container } from '@/shared/ui';

import { AuthHeaderBar } from './auth-header-bar/auth-header-bar';
import { Wrapper } from './auth-header.styled';

export const AuthHeader = () => (
  <Wrapper>
    <Container>
      <AuthHeaderBar />
    </Container>
  </Wrapper>
);
