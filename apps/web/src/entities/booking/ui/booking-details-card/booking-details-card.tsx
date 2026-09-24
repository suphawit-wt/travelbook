// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { Accordion, ButtonLink, Heading, Separator, Text } from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import {
  BookingDetailDateSummary,
  Card,
  CheckInOutItem,
  DateCheckInOutSummary,
} from './booking-details-card.styled';

import type { BookingDetailsCardProps } from './booking-details-card.types';
import type { FC } from 'react';

export const BookingDetailsCard: FC<BookingDetailsCardProps> = ({
  variants = 'info',
  checkInDate,
  checkOutDate,
  ...props
}) => {
  const { t, i18n } = useTranslation('booking');
  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const checkInFullDate = formatLocalizedDateString(
    checkInDate ?? '2026-01-01',
    currentLanguage as Language,
    'full',
  );

  const checkOutFullDate = formatLocalizedDateString(
    checkOutDate ?? '2026-01-02',
    currentLanguage as Language,
    'full',
  );

  return (
    <Card>
      <Heading
        $size="md"
        $weight="bold"
        as="h3"
        style={{ marginBottom: '20px' }}
      >
        {t('booking.title')}
      </Heading>
      <BookingDetailDateSummary>
        <div>
          <DateCheckInOutSummary>
            <CheckInOutItem dateTime={checkInFullDate}>
              <Heading
                $size="sm"
                $weight="normal"
                as="h3"
                style={{ marginBlockEnd: '8px' }}
              >
                {t('booking.dates.checkIn')}
              </Heading>
              <Text $weight="bold" as="div" style={{ marginBlockEnd: '4px' }}>
                {checkInFullDate}
              </Text>
              <Text $color="description" $size="sm" as="div">
                2:00 PM - 7:00 PM
              </Text>
            </CheckInOutItem>
            <div>
              <Separator style={{ height: '100%', width: '1px' }} />
            </div>
            <CheckInOutItem dateTime={checkOutFullDate}>
              <Heading
                $size="sm"
                $weight="normal"
                as="h3"
                style={{ marginBlockEnd: '8px' }}
              >
                {t('booking.dates.checkOut')}
              </Heading>
              <Text $weight="bold" as="div" style={{ marginBlockEnd: '4px' }}>
                {checkOutFullDate}
              </Text>
              <Text $color="description" $size="sm" as="div">
                11:00 AM - 11:00 AM
              </Text>
            </CheckInOutItem>
          </DateCheckInOutSummary>
        </div>
        <div>
          <Text $size="sm">{t('booking.dates.lengthOfStay')}:</Text>
        </div>
        <div>
          <Text $size="sm" $weight="bold">
            {t('booking.dates.nights', { count: props.nights })}
          </Text>
        </div>
      </BookingDetailDateSummary>

      {variants === 'change-details' ? (
        <>
          <Separator style={{ margin: '16px 0' }} />
          <Accordion.Root collapsible type="single">
            <Accordion.Item value="one">
              <Accordion.Trigger>
                <Text as="div" style={{ marginBottom: '6px' }}>
                  {t('booking.guests.title')}
                </Text>
                <Text $size="md" $weight="bold" as="div">
                  {t('booking.guests.roomFor', {
                    count: props.totalRooms ?? 1,
                  })}
                  {t('booking.guests.adults', {
                    count: props.guests?.adults ?? 1,
                  })}
                  {props.guests?.children > 0 &&
                    t('booking.guests.children', {
                      count: props.guests?.children ?? 0,
                    })}
                </Text>
              </Accordion.Trigger>
              <Accordion.Content asChild>
                <div>
                  {props.rooms?.map((room) => (
                    <Text
                      key={`${room.name}-${room.quantity}`}
                      $size="sm"
                      as="div"
                      style={{ marginTop: '16px' }}
                    >
                      {room.quantity}&nbsp;x&nbsp;{room.name}
                    </Text>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          <ButtonLink
            $color="blue"
            $size="sm"
            $variant="ghost"
            href="hotels/malaya"
            style={{ padding: '8px 6px' }}
          >
            {t('booking.actions.changeSelection')}
          </ButtonLink>
        </>
      ) : null}
    </Card>
  );
};
