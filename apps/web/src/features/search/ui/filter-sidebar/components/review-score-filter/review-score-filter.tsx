// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const ReviewScoreFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.reviewScore.title')}
      </Text>

      {/* Score 9+ / Wonderful */}
      <Item>
        <Label
          $size="sm"
          htmlFor="review-score-9plus"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="review-score-9plus" />
          <Text>{t('filters.groups.reviewScore.options.wonderful')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Score 8+ / Very Good */}
      <Item>
        <Label
          $size="sm"
          htmlFor="review-score-8plus"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="review-score-8plus" />
          <Text>{t('filters.groups.reviewScore.options.veryGood')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Score 7+ / Good */}
      <Item>
        <Label
          $size="sm"
          htmlFor="review-score-7plus"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="review-score-7plus" />
          <Text>{t('filters.groups.reviewScore.options.good')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Score 6+ / Pleasant */}
      <Item>
        <Label
          $size="sm"
          htmlFor="review-score-6plus"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="review-score-6plus" />
          <Text>{t('filters.groups.reviewScore.options.pleasant')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
