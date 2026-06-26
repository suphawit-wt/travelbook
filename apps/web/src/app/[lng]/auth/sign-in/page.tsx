// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { AuthSignIn } from '@/features/auth/ui/auth-sign-in';
import { Container } from '@/shared/ui';

import type { FC } from 'react';

const SignIn: FC = () => {
  return (
    <Container>
      <AuthSignIn />
    </Container>
  );
};

export default SignIn;
