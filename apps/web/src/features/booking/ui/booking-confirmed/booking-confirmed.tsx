// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BedSingle,
  Calendar,
  Check,
  Copy,
  Download,
  Printer,
  Tag,
} from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import type { Language } from '@/shared/types/store';
import {
  Button,
  Card,
  Heading,
  IconButton,
  Image,
  Link,
  Separator,
  Skeleton,
  Text,
} from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import { BookingService } from '../../lib/booking.service';

import {
  BetterDealsCard,
  BetterDealsContent,
  BookingSummaryCard,
  ConfirmationCodeCard,
  ImageContainer,
  Main,
  Sidebar,
  SummaryContent,
  SummaryDetail,
  Wrapper,
} from './booking-confirmed.styled';

export const BookingConfirmed = () => {
  const bookingService = new BookingService(axiosClient);

  const { t, i18n } = useTranslation('booking');
  const currency = useAppSelector(selectCurrency);

  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const { slug } = useParams();
  const bookingId = slug as string;

  const { data, isError } = useQuery({
    queryKey: ['booking-confirmation-details', bookingId, currency],
    queryFn: () =>
      bookingService.getBookingConfirmationDetails(bookingId, currency),
  });

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  const checkInFullDate = formatLocalizedDateString(
    data?.booking.checkIn ?? '2026-01-01',
    currentLanguage as Language,
    'full',
  );

  const checkOutFullDate = formatLocalizedDateString(
    data?.booking.checkOut ?? '2026-01-03',
    currentLanguage as Language,
    'full',
  );

  return (
    <Wrapper>
      <Main>
        <Text $color="description" $size="sm">
          {t('confirmation.confirmed')}
        </Text>
        <Heading
          $size="2xl"
          $weight="bold"
          as="h2"
          style={{ marginBlock: '6px' }}
        >
          {t('confirmation.title', {
            destination: data?.property.area ?? 'Area',
          })}
        </Heading>
        <Text $size="sm" startIcon={Check}>
          {t('confirmation.email', {
            email: data?.booking.contactEmail ?? 'example@email.com',
          })}
          &nbsp;
          <Link
            $enableHoverColor
            $color="blue"
            href={`/booking/${bookingId}/edit`}
          >
            {t('actions.edit')}
          </Link>
        </Text>
        <Text $size="sm" startIcon={Check}>
          {t('confirmation.payment')}&nbsp;
          <Link
            $enableHoverColor
            $color="blue"
            href={`/booking/${bookingId}/edit`}
          >
            {t('confirmation.priceDetails')}
          </Link>
        </Text>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBlockStart: '16px',
          }}
        >
          <Button $color="blue" $size="sm" startIcon={Printer}>
            {t('confirmation.print')}
          </Button>
          <Button $color="blue" $size="sm" startIcon={Download}>
            {t('confirmation.saveToPhone')}
          </Button>
        </div>

        <div style={{ marginBlock: '24px' }}>
          <Heading
            $size="lg"
            $weight="bold"
            as="h3"
            style={{ marginBlockEnd: '10px' }}
          >
            {t('confirmation.bookingSumsmary')}
          </Heading>
          <BookingSummaryCard>
            <SummaryContent>
              <ImageContainer>
                <Image fill alt="test 1" src={data?.property.image} />
              </ImageContainer>
              <SummaryDetail>
                <Text $weight="bold" style={{ marginBlockEnd: '4px' }}>
                  {data?.property.name ? (
                    data.property.name
                  ) : (
                    <Skeleton height="20px" width="180px" />
                  )}
                </Text>
                <Text $size="sm" startIcon={Tag}>
                  {t('confirmation.totalPrice')}
                  {t(`price.${currency}`, {
                    amount: data?.booking.totalPrice ?? 0,
                    ns: 'common',
                  })}
                </Text>
                <Text $size="sm" startIcon={Calendar}>
                  {checkInFullDate} - {checkOutFullDate},&nbsp;
                  {t('booking.dates.nights', {
                    count: data?.booking.nights ?? 1,
                  })}
                </Text>
                <Text $size="sm" startIcon={BedSingle}>
                  {data?.booking.rooms ? (
                    data.booking.rooms.map((room) => room.name).join(', ')
                  ) : (
                    <Skeleton height="20px" width="180px" />
                  )}
                </Text>
              </SummaryDetail>
            </SummaryContent>
            <div style={{ alignSelf: 'flex-end' }}>
              <Button $color="blue" $size="sm">
                {t('confirmation.viewOrUpdateDetails')}
              </Button>
            </div>
          </BookingSummaryCard>

          <BetterDealsCard>
            <BetterDealsContent>
              <ImageContainer>
                <Image fill alt="test 1" src={data?.property.image} />
              </ImageContainer>
              <Text as="div">
                {t('confirmation.getABetterRoomForJust')}
                {t(`price.${currency}`, { amount: 2000, ns: 'common' })}
              </Text>
            </BetterDealsContent>
            <div>
              <Button $color="blue" $size="sm" $variant="outline">
                {t('confirmation.showYourOptions')}
              </Button>
            </div>
          </BetterDealsCard>
        </div>
      </Main>

      <Sidebar>
        <ConfirmationCodeCard>
          {data?.booking.confirmationNumber ? (
            <Text $color="black" $size="sm">
              {t('confirmation.confirmationNumber', {
                number: data.booking.confirmationNumber,
              })}
              &nbsp;
              <IconButton $size="sm" $variant="link" icon={Copy} />
            </Text>
          ) : (
            <Skeleton height="20px" width="200px" />
          )}
          {data?.booking.pinCode ? (
            <Text $color="black" $size="sm">
              {t('confirmation.pinCode', { code: data.booking.pinCode })}&nbsp;
              <IconButton $size="sm" $variant="link" icon={Copy} />
            </Text>
          ) : (
            <Skeleton height="20px" width="110px" />
          )}
        </ConfirmationCodeCard>

        <Card.Root $padding="md" $variant="surface">
          <Heading $weight="bold" as="h3" style={{ marginBlockEnd: '16px' }}>
            {t('confirmation.manageYourTripWithTheApp')}
          </Heading>
          <Text $size="sm" startIcon={Check} style={{ marginBlockEnd: '6px' }}>
            {t('confirmation.makeChangesOnTheGo')}
          </Text>
          <Text $size="sm" startIcon={Check} style={{ marginBlockEnd: '6px' }}>
            {t('confirmation.chatWithYourPropertyAnytime')}
          </Text>
          <Text $size="sm" startIcon={Check} style={{ marginBlockEnd: '6px' }}>
            {t('confirmation.getPaperlessConfirmation')}
          </Text>
          <Button
            $color="blue"
            $size="sm"
            $variant="outline"
            style={{ marginBlockStart: '10px' }}
          >
            {t('confirmation.getTheApp')}
          </Button>
        </Card.Root>

        <Card.Root $padding="md" $variant="surface">
          <Heading $weight="bold" as="h3" style={{ marginBlockEnd: '16px' }}>
            {t('confirmation.youveUnlockedADealByBookingWithUs')}
          </Heading>
          <Separator />
        </Card.Root>
      </Sidebar>
    </Wrapper>
  );
};
