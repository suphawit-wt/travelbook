// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { BookingDetailsCard } from '@/entities/booking/ui/booking-details-card/booking-details-card';
import { CostToCancel } from '@/entities/booking/ui/cost-to-cancel/cost-to-cancel';
import { YourPriceSummaryCard } from '@/entities/booking/ui/your-price-summary-card/your-price-summary-card';
import { PropertySummaryCard } from '@/entities/property/ui/property-summary-card/property-summary-card';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';

import { useBooking } from '../../hooks/use-booking';

import { Sidebar, Wrapper } from './booking-detail/booking-detail.styled';

export const BookingDetail = () => {
  const params = useParams();
  const bookingId = params['slug'] as string;
  const currency = useAppSelector(selectCurrency);

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
      </Sidebar>
    </Wrapper>
  );
};
