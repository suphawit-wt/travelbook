// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const AccessibilityFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.accessibility.title')}
      </Text>

      {/* Ground Floor Access Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="access-ground-floor"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="access-ground-floor" />
          <Text>{t('filters.groups.accessibility.options.groundFloor')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Wheelchair Access Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="access-wheelchair"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="access-wheelchair" />
          <Text>{t('filters.groups.accessibility.options.wheelchair')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Walk-in Shower Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="access-walk-in-shower"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="access-walk-in-shower" />
          <Text>{t('filters.groups.accessibility.options.walkInShower')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Raised Toilet Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="access-raised-toilet"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="access-raised-toilet" />
          <Text>{t('filters.groups.accessibility.options.raisedToilet')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
