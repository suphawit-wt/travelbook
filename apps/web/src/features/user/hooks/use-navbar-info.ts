// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useEffect, useMemo, useState } from 'react';

import { selectIsAuthenticated } from '@/features/auth/store/auth.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { axiosClient } from '@/shared/lib/axios-client';

import { UserService } from '../lib/user.service';

import type { NavbarInfoResponse } from '../lib/user.service.types';

export const useNavbarInfo = () => {
  const userService = useMemo(() => new UserService(axiosClient), []);
  const [navbarInfo, setNavbarInfo] = useState<NavbarInfoResponse>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNavbarInfo = async () => {
      try {
        const res = await userService.getNavbarInfo();
        setNavbarInfo(res);
      } catch (err) {
        console.error('Navbar info error', err);
      }
    };

    void fetchNavbarInfo();
  }, [isAuthenticated, userService]);

  return navbarInfo;
};
