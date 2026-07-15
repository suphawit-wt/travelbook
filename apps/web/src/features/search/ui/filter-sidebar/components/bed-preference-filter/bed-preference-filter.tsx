// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const BedPreferenceFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.bed.title')}
      </Text>

      {/* Twin Beds Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="bed-twin-beds"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="bed-twin-beds" />
          <Text>{t('filters.groups.bed.options.twin')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Double Bed Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="bed-double-bed"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="bed-double-bed" />
          <Text>{t('filters.groups.bed.options.double')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
