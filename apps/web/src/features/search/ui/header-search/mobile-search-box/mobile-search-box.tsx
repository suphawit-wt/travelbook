// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Search } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { Icon, Text } from '@/shared/ui';
import { calculateNights, formatLocalizedDate } from '@/shared/utils/date';

import { PopoverButton } from './mobile-search-box.styled';

import type { SearchFormValues } from '../schema';

export const MobileSearchBox = () => {
  const { t, i18n } = useTranslation(['search', 'property']);
  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const { getValues } = useFormContext<SearchFormValues>();
  const destination = getValues('destination');
  const checkIn = getValues('dates.startDate');
  const checkOut = getValues('dates.endDate');
  const adult = getValues('occupancy.adult');

  const formattedCheckIn = formatLocalizedDate(
    checkIn,
    currentLanguage as Language,
    'short',
  );
  const formattedCheckOut = formatLocalizedDate(
    checkOut,
    currentLanguage as Language,
    'short',
  );
  const nights = calculateNights(checkIn, checkOut);

  return (
    <PopoverButton type="button">
      <Icon $size="sm" icon={Search} />
      <div>
        <Text $size="sm" $weight="bold" aria-label="Destination" as="div">
          {destination}
        </Text>
        <div>
          <Text $size="xs" aria-label="Date">
            {formattedCheckIn} - {formattedCheckOut} (
            {t('card.occupancy.nights', { count: nights, ns: 'property' })})
          </Text>
          <Text $size="xs" aria-label="Dot" style={{ margin: '0 4px' }}>
            ·
          </Text>
          <Text $size="xs" aria-label="Occupancy">
            {adult}&nbsp;{t('form.occupancy.adults', { ns: 'search' })}
          </Text>
        </div>
      </div>
    </PopoverButton>
  );
};
