// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const PropertyRatingFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.rating.title')}
      </Text>

      <Text
        $color="description"
        $size="xs"
        style={{ marginTop: 4, display: 'block' }}
      >
        {t('filters.qualityHint')}
      </Text>

      {/* 2 Stars Rating */}
      <Item>
        <Label
          $size="sm"
          htmlFor="rating-stars2"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="rating-stars2" />
          <Text>{t('filters.groups.rating.options.2')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* 3 Stars Rating */}
      <Item>
        <Label
          $size="sm"
          htmlFor="rating-stars3"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="rating-stars3" />
          <Text>{t('filters.groups.rating.options.3')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* 4 Stars Rating */}
      <Item>
        <Label
          $size="sm"
          htmlFor="rating-stars4"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="rating-stars4" />
          <Text>{t('filters.groups.rating.options.4')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
