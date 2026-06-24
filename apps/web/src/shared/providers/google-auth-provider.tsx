// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { env } from '../constants/env';

import type { FC, PropsWithChildren } from 'react';

export const GoogleAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};
