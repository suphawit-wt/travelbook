// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { HeaderSearch } from '@/features/search/ui/header-search';

import type { FC } from 'react';

interface SearchProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Search: FC<SearchProps> = async ({ searchParams }) => {
  const destination = (await searchParams)['dest'] as string;
  const checkIn = (await searchParams)['checkin'] as string;
  const checkOut = (await searchParams)['checkout'] as string;
  const adult = Number((await searchParams)['adult']);
  const children = Number((await searchParams)['children']);
  const room = Number((await searchParams)['room']);

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

export default Search;
