// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { AlarmClock } from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Icon, Text } from '@/shared/ui';

import { AlertCard, AlertDetail } from './limited-offer.styled';

import type { FC } from 'react';

export const LimitedOffer: FC = () => {
  const { t } = useTranslation('booking');

  return (
    <AlertCard>
      <div>
        <Icon $color="red" $size="lg" icon={AlarmClock} />
      </div>

      <AlertDetail>
        <Text $color="black" $weight="bold" as="div">
          {t('booking.availability.limitedTitle')}:
        </Text>
        <Text $color="black" $size="sm" as="div">
          {t('booking.availability.limitedDescription', { count: 5 })}
        </Text>
      </AlertDetail>
    </AlertCard>
  );
};
