// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { PropertySummaryCard } from '@/entities/property/ui/property-summary-card/property-summary-card';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';

import { useBooking } from '../../hooks/use-booking';

import { Sidebar, Wrapper } from './booking-detail.styled';

export const BookingDetail = () => {
  const params = useParams();
  const bookingId = params['slug'] as string;
  const currency = useAppSelector(selectCurrency);

  const { t } = useTranslation(['booking', 'country']);

  const { data, isError } = useBooking(bookingId, currency);

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
      </Sidebar>
    </Wrapper>
  );
};
