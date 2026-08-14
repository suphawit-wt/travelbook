// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useSearchParams } from 'next/navigation';

import { HeaderSearch } from '@/features/search/ui/header-search';

const Hotels = () => {
  const searchParams = useSearchParams();

  const destination = searchParams.get('dest') ?? '';
  const checkIn = searchParams.get('checkin') ?? '';
  const checkOut = searchParams.get('checkout') ?? '';
  const adult = Number(searchParams.get('adult') ?? 2);
  const children = Number(searchParams.get('children') ?? 0);
  const room = Number(searchParams.get('room') ?? 1);

  const searchQuery = {
    destination,
    checkIn,
    checkOut,
    adult,
    children,
    room,
  };

  return <HeaderSearch searchQuery={searchQuery} />;
};

export default Hotels;
