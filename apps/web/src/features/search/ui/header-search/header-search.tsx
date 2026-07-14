// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { BedSingle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { OccupancyPicker } from '@/entities/search/ui/occupancy-picker/occupancy-picker';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Container, DateRangePicker, Input } from '@/shared/ui';

import {
  SearchBar,
  SearchBarWrapper,
  SearchBoxWrapper,
  Wrapper,
} from './header-search.styled';
import { MobileSearchBox } from './mobile-search-box';
import { type SearchFormValues, searchSchema } from './schema';

import type { HeaderSearchProps } from './header-search.types';
import type { FC } from 'react';

export const HeaderSearch: FC<HeaderSearchProps> = ({ searchQuery }) => {
  const { t } = useTranslation('search');
  const router = useRouter();
  const today = new Date();
  const checkIn = new Date(searchQuery.checkIn);
  const checkOut = new Date(searchQuery.checkOut);

  const searchForm = useForm<SearchFormValues>({
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = searchForm;

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

    router.push(`/search?${params.toString()}`);
    router.refresh();
  };

  let destinationErrorMessage = '';

  if (errors.destination !== undefined) {
    if (errors.destination.message === 'required') {
      destinationErrorMessage = t('form.destination.errors.required');
    }
  }

  return (
    <FormProvider {...searchForm}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <SearchBoxWrapper>
            <Container>
              <SearchBar>
                <MobileSearchBox />
              </SearchBar>
            </Container>
          </SearchBoxWrapper>

          <SearchBarWrapper>
            <Container>
              <SearchBar>
                <Input
                  {...register('destination')}
                  $isError={Boolean(errors.destination)}
                  errorDisplay="icon-tooltip"
                  errorMessage={destinationErrorMessage}
                  icon={BedSingle}
                  maxLength={35}
                  placeholder={t('form.destination.placeholder')}
                  type="search"
                />
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
                    <OccupancyPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Button $color="blue" $size="xl" $variant="solid" type="submit">
                  {t('form.cta')}
                </Button>
              </SearchBar>
            </Container>
          </SearchBarWrapper>
        </Wrapper>
      </form>
    </FormProvider>
  );
};
