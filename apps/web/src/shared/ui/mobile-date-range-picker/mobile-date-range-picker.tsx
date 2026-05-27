// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { format } from 'date-fns';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { DateRange, type RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { getDateLocale } from '@/shared/utils/date';

import { Button } from '../button';
import { Drawer } from '../drawer';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Text } from '../text';

import {
  DateRangeWrapper,
  DrawerContent,
  PopoverButton,
} from './mobile-date-range-picker.styled';

import type { MobileDateRangePickerProps } from './mobile-date-range-picker.types';

export const MobileDateRangePicker: FC<MobileDateRangePickerProps> = ({
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

  const disabledAutoFocus = (event: Event) => {
    event.preventDefault();
  };

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
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <PopoverButton disabled={disabled} type="button">
          <Icon icon={CalendarDays} />
          <Text $size="sm" as="span">
            {format(value.startDate, 'EEE, MMM d', { locale: dateLocale })}
            &nbsp;&nbsp;—&nbsp;&nbsp;
            {format(value.endDate, 'EEE, MMM d', { locale: dateLocale })}
          </Text>
          <Icon icon={ChevronDown} />
        </PopoverButton>
      </Drawer.Trigger>
      <Drawer.Portal>
        <DrawerContent onOpenAutoFocus={disabledAutoFocus}>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '12px 20px',
            }}
          >
            <Drawer.Close asChild>
              <Button
                $color="blue"
                style={{
                  minHeight: '48px',
                  width: '100%',
                }}
              >
                {t('actions.done')}
              </Button>
            </Drawer.Close>
          </div>
          <Drawer.Close asChild>
            <IconButton
              $size="sm"
              $variant="ghost"
              icon={X}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            />
          </Drawer.Close>
        </DrawerContent>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
