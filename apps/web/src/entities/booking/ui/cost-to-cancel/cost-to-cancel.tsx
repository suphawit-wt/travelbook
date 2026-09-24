// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { Heading, Text } from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import { Card } from './cost-to-cancel.styled';

import type { YourPriceSummaryCardProps } from './cost-to-cancel.types';
import type { FC } from 'react';

export const CostToCancel: FC<YourPriceSummaryCardProps> = ({
  cancelCost,
  freeCancelDate,
}) => {
  const currency = useAppSelector(selectCurrency);

  const { t, i18n } = useTranslation('booking');

  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const freeCancelShortDate = formatLocalizedDateString(
    freeCancelDate ?? '2026-01-01',
    currentLanguage as Language,
    'short',
  );

  return (
    <Card>
      <Heading
        $size="md"
        $weight="bold"
        as="h2"
        style={{ marginBottom: '16px' }}
      >
        {t('booking.cancellation.title')}
      </Heading>
      <Text $color="green" $size="sm" as="div" style={{ marginBottom: '6px' }}>
        {t('booking.cancellation.freeBefore', { date: freeCancelShortDate })}
      </Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text $size="sm">
          {t('booking.cancellation.after', {
            time: '12:00 AM',
            date: freeCancelShortDate,
          })}
        </Text>
        <Text $size="sm">
          {t(`price.${currency}`, { amount: cancelCost / 2, ns: 'common' })}
        </Text>
      </div>
    </Card>
  );
};
