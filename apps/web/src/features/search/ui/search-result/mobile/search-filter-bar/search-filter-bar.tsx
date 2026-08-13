// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ArrowDownUp, Filter, Map } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/shared/ui';

import { List } from './search-filter-bar.styled';

export const SearchFilterBar = () => {
  const { ref, entry } = useInView({
    threshold: 0,
    rootMargin: '-55px 0px 0px 0px',
  });

  return (
    <List ref={ref} $isActive={entry?.isIntersecting !== true}>
      <li>
        <Button
          $color="blue"
          $size="sm"
          $variant="ghost"
          startIcon={ArrowDownUp}
        >
          Sort
        </Button>
      </li>
      <li>
        <Button $color="blue" $size="sm" $variant="ghost" startIcon={Filter}>
          Filter
        </Button>
      </li>
      <li>
        <Button $color="blue" $size="sm" $variant="ghost" startIcon={Map}>
          Map
        </Button>
      </li>
    </List>
  );
};
