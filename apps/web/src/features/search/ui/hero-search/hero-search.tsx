// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { BedSingle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { OccupancyPicker } from '@/entities/search/ui/occupancy-picker/occupancy-picker';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Checkbox,
  Container,
  DateRangePicker,
  Input,
  Label,
  MobileDateRangePicker,
} from '@/shared/ui';

import { Form, SearchBar, SearchBarOptions } from './hero-search.styled';
import { type SearchFormValues, searchSchema } from './schema';

import type { CheckedState } from '@radix-ui/react-checkbox';

export const HeroSearch = () => {
  const { t } = useTranslation('search');
  const router = useRouter();
  const today = new Date();
  const twoDaysFromNow = addDays(today, 2);

  const searchForm = useForm<SearchFormValues>({
    defaultValues: {
      destination: '',
      dates: {
        startDate: today,
        endDate: twoDaysFromNow,
        key: 'selection',
      },
      occupancy: {
        adult: 2,
        children: 0,
        room: 1,
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

    if (data.occupancy.lookingForApartment) {
      params.append('aptm', '1');
    }
    if (data.occupancy.withPets) {
      params.append('pets', '1');
    }
    if (data.showFlights) {
      params.append('flights', '1');
    }

    router.push(`/search?${params.toString()}`);
  };

  const onCheckedChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') {
      return;
    }

    searchForm.setValue('showFlights', checked);
  };

  let destinationErrorMessage = '';

  if (searchForm.formState.errors.destination !== undefined) {
    if (searchForm.formState.errors.destination.message === 'required') {
      destinationErrorMessage = t('form.destination.errors.required');
    }
  }

  return (
    <FormProvider {...searchForm}>
      <Form noValidate onSubmit={searchForm.handleSubmit(onSubmit)}>
        <Container>
          <SearchBar>
            <Input
              {...searchForm.register('destination')}
              $isError={Boolean(searchForm.formState.errors.destination)}
              errorDisplay="icon-tooltip"
              errorMessage={destinationErrorMessage}
              icon={BedSingle}
              maxLength={35}
              placeholder={t('form.destination.placeholder')}
              type="search"
            />
            <Controller
              control={searchForm.control}
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
              control={searchForm.control}
              name="dates"
              render={({ field }) => (
                <MobileDateRangePicker
                  minDate={today}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
            <Controller
              control={searchForm.control}
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
          <SearchBarOptions>
            <Checkbox
              {...searchForm.register('showFlights')}
              aria-label="show flight"
              id="showFlight"
              onCheckedChange={onCheckedChange}
            />
            <Label $size="sm" htmlFor="showFlight">
              {t('form.extras.showFlights')}
            </Label>
          </SearchBarOptions>
        </Container>
      </Form>
    </FormProvider>
  );
};
