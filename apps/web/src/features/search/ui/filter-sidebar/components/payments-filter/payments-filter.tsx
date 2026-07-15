// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const PaymentsFilter = () => {
  const { t } = useTranslation('search');

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.payment.title')}
      </Text>
      <Item style={{ marginTop: 8 }}>
        <Label
          $size="sm"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          <Checkbox id="online-payment-check" />
          <Text>{t('filters.groups.payment.options.online')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>
    </Group>
  );
};
