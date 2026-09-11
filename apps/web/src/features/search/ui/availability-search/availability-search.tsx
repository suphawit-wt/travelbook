// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { OccupancyPicker } from '@/entities/search/ui/occupancy-picker/occupancy-picker';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Container, DateRangePicker } from '@/shared/ui';

import { Form, SearchBar } from './availability-search.styled';
import { type SearchFormValues, searchSchema } from './schema';

import type { AvailabilitySearchProps } from './availability-search.types';
import type { FC } from 'react';

export const AvailabilitySearch: FC<AvailabilitySearchProps> = ({
  searchQuery,
}) => {
  const { t } = useTranslation('search');
  const router = useRouter();
  const pathname = usePathname();
  const checkIn = new Date(searchQuery.checkIn);
  const checkOut = new Date(searchQuery.checkOut);
  const today = new Date();

  const { control, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: {
      destination: searchQuery.destination,
      dates: {
        startDate: checkIn,
        endDate: checkOut,
        key: 'selection',
      },
      occupancy: {
        adult: searchQuery.adult,
        children: searchQuery.children,
        room: searchQuery.room,
        lookingForApartment: false,
        withPets: false,
      },
      showFlights: false,
    },
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormValues) => {
    const params = new URLSearchParams({
      dest: data.destination,
      checkin: format(data.dates.startDate, 'yyyy-MM-dd'),
      checkout: format(data.dates.endDate, 'yyyy-MM-dd'),
      adult: data.occupancy.adult.toString(),
      children: data.occupancy.children.toString(),
      room: data.occupancy.room.toString(),
    });

    if (data.occupancy.lookingForApartment) params.append('aptm', '1');
    if (data.occupancy.withPets) params.append('pets', '1');
    if (data.showFlights) params.append('flights', '1');

    router.replace(`${pathname}?${params.toString()}#availability`);
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <SearchBar>
          <Controller
            control={control}
            name="dates"
            render={({ field }) => (
              <DateRangePicker
                minDate={today}
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
          <Controller
            control={control}
            name="occupancy"
            render={({ field }) => (
              <OccupancyPicker value={field.value} onChange={field.onChange} />
            )}
          />
          <Button $color="blue" $variant="solid" type="submit">
            {t('form.changeSearch')}
          </Button>
        </SearchBar>
      </Container>
    </Form>
  );
};
