// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const ActivitiesFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.activities.title')}
      </Text>

      {/* Snorkeling Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="activity-snorkeling"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="activity-snorkeling" />
          <Text>{t('filters.groups.activities.options.snorkeling')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Diving Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="activity-diving"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="activity-diving" />
          <Text>{t('filters.groups.activities.options.diving')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Beach Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="activity-beach"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="activity-beach" />
          <Text>{t('filters.groups.activities.options.beach')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Fishing Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="activity-fishing"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="activity-fishing" />
          <Text>{t('filters.groups.activities.options.fishing')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
