// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Elements } from '@stripe/react-stripe-js';
import { type StripeElementLocale, loadStripe } from '@stripe/stripe-js';
import { notFound, useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

import { BookingDetailsCard } from '@/entities/booking/ui/booking-details-card/booking-details-card';
import { CostToCancel } from '@/entities/booking/ui/cost-to-cancel/cost-to-cancel';
import { LimitedOffer } from '@/entities/booking/ui/limited-offer/limited-offer';
import { MyBookingConditions } from '@/entities/booking/ui/my-booking-conditions/my-booking-conditions';
import { YourPriceSummaryCard } from '@/entities/booking/ui/your-price-summary-card/your-price-summary-card';
import { PropertySummaryCard } from '@/entities/property/ui/property-summary-card/property-summary-card';
import { PaymentService } from '@/features/payments/lib/payment.service';
import { CheckoutForm } from '@/features/payments/ui/checkout-form/checkout-form';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { env } from '@/shared/constants/env';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Heading, Input, Label, Text } from '@/shared/ui';

import { useBooking } from '../../hooks/use-booking';

import {
  Card,
  FormActionGroup,
  InputGroup,
  Main,
  Sidebar,
  Wrapper,
} from './finish-booking.styled';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const FinishBooking = () => {
  const paymentService = useMemo(() => new PaymentService(axiosClient), []);

  const { t, i18n } = useTranslation('booking');
  const { theme } = useTheme();
  const params = useParams();
  const bookingId = params['slug'] as string;
  const currency = useAppSelector(selectCurrency);

  const [stripeClientSecret, setStripeClientSecret] = useState('');

  const currentLanguage = (i18n.resolvedLanguage ??
    'en') as StripeElementLocale;

  let elementsBgColor = 'hsl(0, 0%, 100%)';
  let elementsTextColor = 'hsl(0, 0%, 10%)';

  if (theme === 'dark') {
    elementsBgColor = 'hsl(0, 0%, 10%)';
    elementsTextColor = 'hsl(0, 0%, 90%)';
  }

  const { data, isError } = useBooking(bookingId, currency);

  useEffect(() => {
    const fetchBookingPayments = async () => {
      try {
        const data = await paymentService.createBookingPayments(bookingId);

        setStripeClientSecret(data.clientSecret);
      } catch (err) {
        // eslint-disable-next-line no-console -- for test
        console.error('fetch booking payments error', err);
      }
    };

    void fetchBookingPayments();
    // Intentionally empty dependency array: only run on mount.
  }, [bookingId, paymentService]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <Wrapper>
      <Sidebar>
        <PropertySummaryCard
          area={data?.property.area ?? ''}
          countryCode={data?.property.countryCode ?? ''}
          name={data?.property.name ?? ''}
          rating={data?.property.avgRating ?? 0}
          reviewCount={data?.property.reviewCount ?? 0}
          type={data?.property.type ?? 'hotel'}
          zipCode={data?.property.zipCode ?? ''}
        />

        <BookingDetailsCard
          checkInDate={data?.booking.checkIn}
          checkOutDate={data?.booking.checkOut}
          guests={data?.booking.guests}
          nights={data?.booking.nights ?? 1}
          rooms={data?.booking.rooms}
          totalRooms={data?.booking.totalRooms}
          variants="change-details"
        />

        <YourPriceSummaryCard
          price={data?.booking.totalPrice}
          taxesAndFees={data?.booking.taxesAndFees}
        />

        <CostToCancel
          cancelCost={data?.booking.totalPrice ?? 0}
          freeCancelDate={data?.booking.freeCancelDate}
        />

        <Card>
          <Heading
            $size="md"
            $weight="bold"
            as="h2"
            style={{ marginBottom: '16px' }}
          >
            {t('payment.title')}
          </Heading>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text $size="sm">{t('payment.payNow')}</Text>
            <Text $size="sm">
              {t('booking.price.amount', {
                currency,
                price: data?.booking.totalPrice ?? 0,
              })}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBlockStart: '4px',
            }}
          >
            <Text $size="sm">{t('payment.payLater')}</Text>
            <Text $size="sm">
              {t('booking.price.amount', { currency, price: 0 })}
            </Text>
          </div>
        </Card>

        <Card>
          <Heading
            $size="md"
            $weight="bold"
            as="h2"
            style={{ marginBottom: '16px' }}
          >
            {t('payment.promo.question')}
          </Heading>

          <InputGroup>
            <Label $size="sm" htmlFor="promo_code">
              {t('payment.promo.placeholder')}
            </Label>
            <Input
              id="promo_code"
              maxLength={10}
              name="promo_code"
              type="text"
            />
            <Button
              $color="blue"
              $size="sm"
              $variant="outline"
              style={{ marginBlockStart: '6px' }}
            >
              {t('actions.apply')}
            </Button>
          </InputGroup>
        </Card>

        <LimitedOffer />
      </Sidebar>

      <Main>
        <Card>
          <Heading
            $size="xl"
            $weight="bold"
            as="h2"
            style={{ marginBottom: '16px' }}
          >
            {t('payment.methods.online')}
          </Heading>
          <Text $size="sm">{t('payment.methods.completeBooking')}</Text>
        </Card>

        {stripeClientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: stripeClientSecret,
              locale: currentLanguage,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorBackground: elementsBgColor,
                  colorText: elementsTextColor,
                },
              },
            }}
          >
            <CheckoutForm propertyName={data?.property.name} />
          </Elements>
        ) : null}

        <FormActionGroup>
          <MyBookingConditions freeCancelDate={data?.booking.freeCancelDate} />
        </FormActionGroup>
      </Main>
    </Wrapper>
  );
};
