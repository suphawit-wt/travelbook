// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ChevronsUpDown, Filter } from 'lucide-react';

import { Button } from '@/shared/ui';

import { List } from './mobile-filter-list.styled';

export const MobileFilterList = () => {
  return (
    <List>
      <li>
        <Button $radius="full" $size="sm" $variant="outline">
          Breakfast included (115)
        </Button>
      </li>
      <li>
        <Button $radius="full" $size="sm" $variant="outline">
          Very Good: 8+ (78)
        </Button>
      </li>
      <li>
        <Button $radius="full" $size="sm" $variant="outline">
          Hotels (37)
        </Button>
      </li>
      <li>
        <Button $radius="full" $size="sm" $variant="outline">
          Free cancellation (25)
        </Button>
      </li>
      <li>
        <Button
          $iconSize="sm"
          $radius="full"
          $size="sm"
          $variant="outline"
          endIcon={ChevronsUpDown}
          startIcon={Filter}
        >
          See all filters
        </Button>
      </li>
    </List>
  );
};
