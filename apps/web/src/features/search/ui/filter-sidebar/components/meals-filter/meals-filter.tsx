// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const MealsFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.meals.title')}
      </Text>

      {/* Kitchen Facilities Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="meal-kitchen-facilities"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="meal-kitchen-facilities" />
          <Text>{t('filters.groups.meals.options.kitchen')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Breakfast Included Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="meal-breakfast-included"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="meal-breakfast-included" />
          <Text>{t('filters.groups.meals.options.breakfast')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
