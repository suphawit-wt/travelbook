// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { useQuery } from '@tanstack/react-query';

import { axiosClient } from '@/shared/lib/axios-client';

import { BookingService } from '../lib/booking.service';
import { bookingKeys } from '../lib/query-keys';

export const useBooking = (bookingId: string, currency: string) => {
  const bookingService = new BookingService(axiosClient);

  return useQuery({
    queryKey: bookingKeys.detail(bookingId, currency),

    queryFn: () => bookingService.getBookingById(bookingId, currency),

    select: (res) => res,

    enabled: Boolean(bookingId), // avoid empty calls

    staleTime: 1000 * 30, // 30s cache
    gcTime: 1000 * 60 * 5, // 5 min

    retry: 2,

    refetchOnWindowFocus: false,
  });
};
