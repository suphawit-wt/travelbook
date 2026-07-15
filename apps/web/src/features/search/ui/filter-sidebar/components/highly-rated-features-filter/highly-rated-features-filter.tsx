// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const HighlyRatedFeaturesFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.features.title')}
      </Text>
      <Text
        $color="description"
        $size="xs"
        style={{ marginTop: 4, display: 'block' }}
      >
        {t('filters.reviewsBased')}
      </Text>

      {/* Very Good Breakfast Option */}
      <Item style={{ marginTop: 8 }}>
        <Label
          $size="sm"
          htmlFor="feature-very-good-breakfast"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="feature-very-good-breakfast" />
          <Text>{t('filters.groups.features.options.breakfast')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Very Clean Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="feature-very-clean"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="feature-very-clean" />
          <Text>{t('filters.groups.features.options.clean')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Very Good Location Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="feature-very-good-location"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="feature-very-good-location" />
          <Text>{t('filters.groups.features.options.location')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Very Good Wi-Fi Option */}
      <Item>
        <Label
          $size="sm"
          htmlFor="feature-very-good-wifi"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="feature-very-good-wifi" />
          <Text>{t('filters.groups.features.options.wifi')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
