// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const PopularFilters = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.popular')}
      </Text>

      {/* Free Cancellation */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-free-cancellation"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-free-cancellation" />
          <Text>{t('filters.groups.policies.options.freeCancellation')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Parking */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-parking"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-parking" />
          <Text>{t('filters.groups.facilities.options.parking')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Breakfast Included */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-breakfast-included"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-breakfast-included" />
          <Text>{t('filters.groups.meals.options.breakfast')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Sea View */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-sea-view"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-sea-view" />
          <Text>{t('filters.groups.roomFeatures.options.seaView')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Property Type Hotel */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-property-type-hotel"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-property-type-hotel" />
          <Text>{t('filters.groups.propertyType.options.hotels')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* No Prepayment */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-no-prepayment"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-no-prepayment" />
          <Text>{t('filters.groups.policies.options.noPrepayment')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Review 9+ (Wonderful) */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-review-9plus"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-review-9plus" />
          <div>
            <Text>{t('filters.groups.reviewScore.options.wonderful')}</Text>
            <Text $color="description" $size="xs" as="div">
              {t('filters.reviewsBased')}
            </Text>
          </div>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Hot Tub */}
      <Item>
        <Label
          $size="sm"
          htmlFor="popular-hot-tub"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="popular-hot-tub" />
          <Text>{t('filters.groups.facilities.options.hotTub')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
