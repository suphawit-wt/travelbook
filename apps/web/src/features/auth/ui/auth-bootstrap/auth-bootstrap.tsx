// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useEffect, useMemo } from 'react';

import { useAppDispatch } from '@/shared/hooks/store';

import { AuthService } from '../../lib/auth.service';
import { setAccessToken } from '../../store/auth.slice';

import type { AuthBootstrapProps } from './auth-bootstrap.types';
import type { FC } from 'react';

export const AuthBootstrap: FC<AuthBootstrapProps> = ({ hasAuthSession }) => {
  const authService = useMemo(() => new AuthService(), []);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = await authService.userRefreshToken();
        dispatch(setAccessToken(token));
      } catch (err) {
        // eslint-disable-next-line no-console -- for test
        console.error('Token refresh error', err);
      }
    };

    if (hasAuthSession) {
      void refreshToken();
    }
  }, [authService, dispatch, hasAuthSession]);

  return null;
};
