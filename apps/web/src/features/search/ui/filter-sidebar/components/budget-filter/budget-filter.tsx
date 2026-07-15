// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useState } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Slider, Text } from '@/shared/ui';

import { Group } from '../../filter-sidebar.styled';

const MIN_BUDGET = 700;
const MAX_BUDGET = 10000;

export const BudgetFilter = () => {
  const { t } = useTranslation('search');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    MIN_BUDGET,
    MAX_BUDGET,
  ]);

  const handleBudgetChange = (value: number[]) => {
    if (value[0] !== undefined && value[1] !== undefined) {
      setBudgetRange([value[0], value[1]]);
    }
  };

  return (
    <Group>
      <Text $size="sm" $weight="bold" style={{ marginBottom: '16px' }}>
        {t('filters.budget')}
      </Text>
      <Text $size="sm" style={{ marginBottom: '10px' }}>
        THB {budgetRange[0].toLocaleString()} - THB{' '}
        {budgetRange[1].toLocaleString()}+
      </Text>
      <Slider
        defaultValue={budgetRange}
        max={MAX_BUDGET}
        min={MIN_BUDGET}
        minStepsBetweenThumbs={1}
        step={100}
        onValueChange={handleBudgetChange}
      />
    </Group>
  );
};
