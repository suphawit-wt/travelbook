// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { subDays } from 'date-fns';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { formatLocalizedDate, getDateLocale } from '@/shared/utils/date';

import { Icon } from '../icon';
import { Popover } from '../popover';
import { Text } from '../text';

import { CalendarWrapper, PopoverButton } from './date-picker.styled';

import type { DatePickerProps } from './date-picker.types';

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.resolvedLanguage ?? 'en';
  const [mounted, setMounted] = useState(false);
  const today = new Date();
  const yesterday = subDays(today, 1);

  const dateLocale = useMemo(
    () => getDateLocale((i18n.resolvedLanguage ?? 'en') as Language),
    [i18n.resolvedLanguage],
  );

  const formattedLabel: string = useMemo(() => {
    if (!value) {
      return placeholder ?? t('form.dates.placeholder', { ns: 'common' });
    }
    return formatLocalizedDate(value, currentLanguage as Language, 'numeric');
  }, [value, placeholder, t, currentLanguage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- for client render
    setMounted(true);
  }, []);

  const handleSelect = (date: Date) => {
    onChange(date);
  };

  if (!mounted) {
    return (
      <PopoverButton type="button">
        <Icon icon={CalendarDays} />
        <Text $size="sm" as="span">
          {formattedLabel}
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
            {formattedLabel}
          </Text>
        </PopoverButton>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CalendarWrapper>
            <Calendar
              date={value ?? yesterday}
              locale={dateLocale}
              maxDate={maxDate}
              minDate={minDate}
              onChange={handleSelect}
            />
          </CalendarWrapper>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
