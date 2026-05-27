// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { format } from 'date-fns';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { DateRange, type RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { getDateLocale } from '@/shared/utils/date';

import { Icon } from '../icon';
import { Popover } from '../popover';
import { Text } from '../text';

import {
  DateRangeWrapper,
  PopoverButton,
  PopoverContent,
} from './date-range-picker.styled';

import type { DateRangePickerProps } from './date-range-picker.types';

export const DateRangePicker: FC<DateRangePickerProps> = ({
  value,
  onChange,
  minDate,
  months = 2,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation('common');
  const [mounted, setMounted] = useState(false);

  const dateLocale = useMemo(
    () => getDateLocale((i18n.resolvedLanguage ?? 'en') as Language),
    [i18n.resolvedLanguage],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (ranges: RangeKeyDict) => {
    if (ranges['selection']) {
      onChange(ranges['selection']);
    }
  };

  if (!mounted) {
    return (
      <PopoverButton type="button">
        <Icon icon={CalendarDays} />
        <Text $size="sm" as="span">
          {t('dates.checkIn')}
          &nbsp;—&nbsp;
          {t('dates.checkOut')}
        </Text>
        <Icon icon={ChevronDown} />
      </PopoverButton>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <PopoverButton disabled={disabled} type="button">
          <Icon icon={CalendarDays} />
          <Text $size="sm" as="span">
            {format(value.startDate, 'EEE, MMM d', { locale: dateLocale })}
            &nbsp;&nbsp;—&nbsp;&nbsp;
            {format(value.endDate, 'EEE, MMM d', { locale: dateLocale })}
          </Text>
          <Icon icon={ChevronDown} />
        </PopoverButton>
      </Popover.Trigger>

      <Popover.Portal>
        <PopoverContent
          align="start"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DateRangeWrapper>
            <DateRange
              direction="horizontal"
              locale={dateLocale}
              minDate={minDate ?? new Date()}
              months={months}
              moveRangeOnFirstSelection={false}
              ranges={[value]}
              onChange={handleSelect}
            />
          </DateRangeWrapper>
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
};
