// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Label, NumberInput, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const RoomsFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.rooms.title')}
      </Text>

      <Item>
        <Label $size="sm" htmlFor="filter-bedrooms">
          <Text>{t('filters.groups.rooms.options.bedrooms')}</Text>
        </Label>
        <NumberInput id="filter-bedrooms" max={10} min={0} value={0} />
      </Item>

      <Item>
        <Label $size="sm" htmlFor="filter-bathrooms">
          <Text>{t('filters.groups.rooms.options.bathrooms')}</Text>
        </Label>
        <NumberInput id="filter-bathrooms" max={10} min={0} value={0} />
      </Item>
    </Group>
  );
};
