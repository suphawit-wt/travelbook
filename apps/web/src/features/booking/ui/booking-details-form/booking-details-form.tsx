// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  CarFront,
  CarTaxiFront,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CigaretteOff,
  Clock,
  Coffee,
  Info,
  UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Trans } from 'react-i18next';
import PhoneInput, { type Country } from 'react-phone-number-input/input';
import { z } from 'zod';

import { WePriceMatch } from '@/entities/property/ui/we-price-match/we-price-match';
import { countries } from '@/shared/data/countries';
import { phoneCountryOptions } from '@/shared/data/phone-countries';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import type { Language } from '@/shared/types/store';
import {
  Button,
  Checkbox,
  Heading,
  HoverCard,
  Icon,
  Input,
  Label,
  RadioGroup,
  Select,
  Separator,
  Text,
} from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import { BookingService } from '../../lib/booking.service';

import {
  AddonInputDetail,
  AddonInputGroup,
  AddonItem,
  AddonList,
  ButtonGroup,
  Card,
  CheckInOutItem,
  CheckboxGroup,
  DateCheckInOutSummary,
  FormActionGroup,
  InputFormGroup,
  InputGroup,
  PhoneCountryCodeLabel,
  PhoneCountryCodeSelect,
  PhoneInputWrapper,
  PhoneNumberInputGroup,
  PhoneNumberSelectGroup,
  RoomBenefitsList,
  SelectInputGroup,
  TextAreaInput,
} from './booking-details-form.styled';

import type {
  BookingInfoResponse,
  PropertyInfoResponse,
  UpdateBookingDetailsRequest,
} from '../../lib/booking.service.types';

export const BookingDetailsForm = ({
  bookingId,
  booking,
  property,
}: {
  bookingId: string;
  booking?: BookingInfoResponse;
  property?: PropertyInfoResponse;
}) => {
  const bookingService = new BookingService(axiosClient);

  const { t, i18n } = useTranslation(['booking', 'country', 'common']);

  const router = useRouter();
  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const updateBookingDetailsMutation = useMutation({
    mutationFn: (req: UpdateBookingDetailsRequest) =>
      bookingService.updateBookingDetails(bookingId, req),

    onSuccess: () => {
      router.push(`/booking/${bookingId}/payment`);
    },

    onError: (err: unknown) => {
      console.error(err);
    },
  });

  const bookingDetailsSchema = z.object({
    firstName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('form.fields.firstName.label'),
        ns: 'common',
      }),
    }),
    lastName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('form.fields.lastName.label'),
        ns: 'common',
      }),
    }),
    email: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('form.fields.email.label'),
          ns: 'common',
        }),
      })
      .email({
        message: t('form.errors.email'),
      }),
    countryCode: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('form.fields.country.label'),
        ns: 'common',
        interpolation: { escapeValue: false },
      }),
    }),
    phoneCountry: z.string(),
    phoneNumber: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('form.fields.phone.label'),
        ns: 'common',
      }),
    }),
    guestName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('form.guestName.label'),
        ns: 'common',
      }),
    }),
    specialRequests: z.string().optional(),
  });

  type BookingDetailsFormValues = z.infer<typeof bookingDetailsSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingDetailsFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '',
      phoneCountry: 'TH',
      phoneNumber: '',
      guestName: '',
      specialRequests: '',
    },
    resolver: zodResolver(bookingDetailsSchema),
  });

  const selectedCountry = useWatch({ control, name: 'phoneCountry' });
  const currentCountryLabel = useMemo(() => {
    const found = phoneCountryOptions.find(
      (opt) => opt.value === selectedCountry.toLowerCase(),
    );
    return found ? found.shortLabel : 'TH +66';
  }, [selectedCountry]);

  const onSubmit = (data: BookingDetailsFormValues) => {
    const req: UpdateBookingDetailsRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      countryCode: data.countryCode,
      phone: data.phoneNumber,
      guestName: data.guestName,
      specialRequests: data.specialRequests,
    };

    updateBookingDetailsMutation.mutate(req);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBottom: '16px' }}
        >
          {t('user.enterDetails')}
        </Heading>
        <Text $color="red" $size="sm" startIcon={Info}>
          {t('user.almostDone')}
        </Text>
        <InputFormGroup>
          <InputGroup>
            <Label $size="sm" htmlFor="first_name">
              {t('form.fields.firstName.label')}&nbsp;
              <Text $color="red" $size="xs">
                *
              </Text>
            </Label>
            <Input
              {...register('firstName')}
              $isError={Boolean(errors.firstName)}
              errorMessage={errors.firstName?.message}
              id="firstName"
              maxLength={80}
              name="firstName"
              type="text"
            />
          </InputGroup>
          <InputGroup>
            <Label $size="sm" htmlFor="last_name">
              {t('form.fields.lastName.label')}&nbsp;
              <Text $color="red" $size="xs">
                *
              </Text>
            </Label>
            <Input
              {...register('lastName')}
              $isError={Boolean(errors.lastName)}
              errorMessage={errors.lastName?.message}
              id="lastName"
              maxLength={80}
              name="lastName"
              type="text"
            />
          </InputGroup>
          <InputGroup>
            <Label $size="sm" htmlFor="email">
              {t('form.fields.email.label')}&nbsp;
              <Text $color="red" $size="xs">
                *
              </Text>
            </Label>
            <Input
              {...register('email')}
              $isError={Boolean(errors.email)}
              errorMessage={errors.email?.message}
              id="email"
              maxLength={80}
              name="email"
              type="email"
            />
            <Text $color="description" $size="xs" as="div">
              {t('form.fields.email.description')}
            </Text>
          </InputGroup>
          <div />
          <InputGroup>
            <Label $size="sm" htmlFor="country">
              {t('form.fields.country.label')}&nbsp;
              <Text $color="red" $size="xs">
                *
              </Text>
            </Label>
            <SelectInputGroup>
              <Select.Root
                {...register('countryCode')}
                required
                $isError={Boolean(errors.countryCode)}
                errorMessage={errors.countryCode?.message}
                id="countryCode"
              >
                <Select.Option disabled value="none">
                  {t('form.fields.country.placeholder')}
                </Select.Option>
                {countries.map((country) => (
                  <Select.Option key={country.code} value={country.code}>
                    {t(country.code, { ns: 'country' })}
                  </Select.Option>
                ))}
              </Select.Root>
              <span>
                <Icon icon={ChevronDown} />
              </span>
            </SelectInputGroup>
            {errors.countryCode ? (
              <Text $color="red" $size="sm">
                {errors.countryCode.message}
              </Text>
            ) : null}
          </InputGroup>
          <div />
          <InputGroup>
            <Label $size="sm" htmlFor="phone_number">
              {t('form.fields.phone.label')}&nbsp;
              <Text $color="red" $size="xs">
                *
              </Text>
            </Label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'initial',
                alignItems: 'stretch',
                flexDirection: 'column',
              }}
            >
              <PhoneNumberInputGroup>
                <div style={{ flexShrink: '0' }}>
                  <PhoneNumberSelectGroup>
                    <PhoneCountryCodeSelect
                      required
                      id="phoneCountry"
                      {...register('phoneCountry')}
                    >
                      {phoneCountryOptions.map((phoneCountry) => (
                        <option
                          key={phoneCountry.value}
                          value={phoneCountry.value}
                          selected={
                            selectedCountry.toLowerCase() === phoneCountry.value
                          }
                        >
                          {phoneCountry.label}
                        </option>
                      ))}
                    </PhoneCountryCodeSelect>
                    <PhoneCountryCodeLabel>
                      {currentCountryLabel}
                    </PhoneCountryCodeLabel>
                    <span>
                      <Icon icon={ChevronDown} />
                    </span>
                  </PhoneNumberSelectGroup>
                </div>
                <PhoneInputWrapper>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <PhoneInput
                        country={selectedCountry.toUpperCase() as Country}
                        id="phoneNumber"
                        maxLength={80}
                        name={field.name}
                        value={field.value || undefined}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </PhoneInputWrapper>
              </PhoneNumberInputGroup>
            </div>
            {errors.phoneNumber ? (
              <Text $color="red" $size="sm">
                {errors.phoneNumber.message}
              </Text>
            ) : null}
            <Text
              $color="description"
              $size="xs"
              as="div"
              style={{ marginBlockStart: '4px' }}
            >
              {t('form.fields.phone.description')}
            </Text>
          </InputGroup>
          <div />
        </InputFormGroup>
        <CheckboxGroup>
          <Checkbox
            aria-label="paperless confirmation"
            id="paperless_confirm"
          />
          <Label
            htmlFor="paperless_confirm"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text $size="sm" as="div">
              {t('form.fields.paperless.label')}
            </Text>
            <Text $color="description" $size="xs" as="div">
              {t('form.fields.paperless.description')}
            </Text>
          </Label>
        </CheckboxGroup>
        <Separator style={{ margin: '16px 0' }} />
        <Text $size="sm" as="div" style={{ marginBottom: '10px' }}>
          {t('form.bookingFor.label')}&nbsp;
          <Text $color="description">({t('form.optional')})</Text>
        </Text>
        <RadioGroup.Root defaultValue="bookfor_mainguest">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RadioGroup.Item id="bookfor_mainguest" value="bookfor_mainguest">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label $size="sm" htmlFor="bookfor_mainguest">
              {t('form.bookingFor.self')}
            </Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RadioGroup.Item id="bookfor_someone" value="bookfor_someone">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label $size="sm" htmlFor="bookfor_someone">
              {t('form.bookingFor.other')}
            </Label>
          </div>
        </RadioGroup.Root>

        <Text
          $size="sm"
          as="div"
          style={{ marginTop: '16px', marginBottom: '10px' }}
        >
          {t('form.travelPurpose.label')}&nbsp;
          <Text $color="description">({t('form.optional')})</Text>
        </Text>
        <RadioGroup.Root
          defaultValue="travelforwork_no"
          style={{ flexDirection: 'row' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RadioGroup.Item id="travelforwork_yes" value="travelforwork_yes">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label $size="sm" htmlFor="travelforwork_yes">
              {t('form.options.yes')}
            </Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RadioGroup.Item id="travelforwork_no" value="travelforwork_no">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label $size="sm" htmlFor="travelforwork_no">
              {t('form.options.no')}
            </Label>
          </div>
        </RadioGroup.Root>
      </Card>

      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBottom: '12px' }}
        >
          {t('form.goodToKnow.title')}:
        </Heading>
        <Text
          $iconColor="green"
          $size="sm"
          as="div"
          startIcon={CheckCircle2}
          style={{ marginBottom: '4px' }}
        >
          {booking?.freeCancelDate
            ? t('form.goodToKnow.stayFlexible', {
                cancelDate: formatLocalizedDateString(
                  booking.freeCancelDate,
                  currentLanguage as Language,
                  'full',
                ),
              })
            : null}
        </Text>
        <Text $iconColor="red" $size="sm" as="div" startIcon={Clock}>
          {t('form.goodToKnow.lastRoom', {
            room: booking?.rooms.map((room) => room.name).join(', '),
            hotelName: property?.name,
          })}
        </Text>
      </Card>

      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBottom: '16px' }}
        >
          {booking?.rooms.map((room) => room.name).join(', ')}
        </Heading>
        <RoomBenefitsList>
          <li>
            <Text $color="green" $size="sm" $weight="bold" startIcon={Coffee}>
              Breakfast included in the price
            </Text>
          </li>
          <li>
            <Text $color="green" $size="sm" as="div">
              <Trans
                i18nKey="policies.cancellation.free.title"
                t={t}
                components={[
                  // eslint-disable-next-line react/jsx-key -- for translate
                  <b />,
                ]}
                values={{
                  date: formatLocalizedDateString(
                    booking?.freeCancelDate ?? '2026-06-05',
                    currentLanguage as Language,
                    'short',
                  ),
                }}
              />
            </Text>
          </li>
          <li>
            <Text $size="sm" startIcon={UsersRound}>
              <b>{t('user.guests')}:</b>{' '}
              {t('booking.guests.adults', {
                count: booking?.guests.adults,
              })}
            </Text>
          </li>
          <li>
            <Text $size="sm" startIcon={CigaretteOff}>
              No smoking
            </Text>
          </li>
        </RoomBenefitsList>
        <InputFormGroup style={{ marginBottom: '0' }}>
          <InputGroup>
            <Label $size="sm" $weight="bold" htmlFor="full_guestname">
              {t('form.guestName.label')}
            </Label>
            <Input
              {...register('guestName')}
              $isError={Boolean(errors.guestName)}
              errorMessage={errors.guestName?.message}
              id="guestName"
              maxLength={80}
              name="guestName"
              placeholder={t('form.guestName.placeholder')}
              type="text"
            />
          </InputGroup>
        </InputFormGroup>
      </Card>

      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBlockEnd: '16px' }}
        >
          {t('form.extras.title')}
        </Heading>
        <AddonList>
          <li>
            <AddonItem>
              <AddonInputGroup>
                <Checkbox id="addon_rentcar" />
                <AddonInputDetail>
                  <Label $size="sm" htmlFor="addon_rentcar">
                    {t('form.extras.carRental.label')}
                  </Label>
                  <Text $color="description" $size="sm">
                    {t('form.extras.carRental.description')}
                  </Text>
                </AddonInputDetail>
              </AddonInputGroup>
              <Icon $size="lg" icon={CarFront} />
            </AddonItem>
          </li>
          <li>
            <AddonItem>
              <AddonInputGroup>
                <div>
                  <Checkbox id="addon_taxi" />
                </div>
                <AddonInputDetail>
                  <Label $size="sm" htmlFor="addon_taxi">
                    {t('form.extras.transport.label')}
                  </Label>
                  <Text $color="description" $size="sm">
                    {t('form.extras.transport.description')}
                  </Text>
                </AddonInputDetail>
              </AddonInputGroup>
              <div>
                <Icon $size="lg" icon={CarTaxiFront} />
              </div>
            </AddonItem>
          </li>
        </AddonList>
      </Card>

      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBlockEnd: '16px' }}
        >
          {t('form.specialRequests.label')}
        </Heading>
        <Text $size="sm">{t('form.specialRequests.description')}</Text>
        <div style={{ marginBlockStart: '16px' }}>
          <Label
            $size="sm"
            htmlFor="special_requests"
            style={{ marginBlockEnd: '6px' }}
          >
            {t('form.specialRequests.placeholder')}&nbsp;
            <Text $color="description">({t('form.optional')})</Text>
          </Label>
          <TextAreaInput
            {...register('specialRequests')}
            $isError={Boolean(errors.specialRequests)}
            errorMessage={errors.specialRequests?.message}
            name="specialRequests"
          />
        </div>
      </Card>

      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBlockEnd: '16px' }}
        >
          {t('form.arrival.label')}
        </Heading>
        <Text
          $iconColor="green"
          $iconSize="lg"
          $size="sm"
          startIcon={CheckCircle2}
        >
          {t('form.arrival.description', {
            checkIn: '12:00 PM',
            checkOut: '1:00 AM',
          })}
        </Text>

        <InputFormGroup style={{ marginBottom: '0' }}>
          <InputGroup>
            <Label $size="sm" htmlFor="arrival_time">
              {t('form.arrival.estimated.label')}&nbsp;
              <Text $color="description" $size="xs">
                ({t('form.optional')})
              </Text>
            </Label>
            <SelectInputGroup>
              <Select.Root
                defaultValue="none"
                id="arrival_time"
                name="arrival_time"
              >
                <Select.Option disabled value="none">
                  {t('form.arrival.estimated.placeholder')}
                </Select.Option>
                <Select.Option value="-1">
                  {' '}
                  {t('form.arrival.estimated.unknown')}
                </Select.Option>
                <Select.Option value="0">12:00 AM - 1:00 AM</Select.Option>
                <Select.Option value="1">1:00 AM - 2:00 AM</Select.Option>
              </Select.Root>
              <span>
                <Icon icon={ChevronDown} />
              </span>
            </SelectInputGroup>
            <Text
              $color="description"
              $size="sm"
              as="div"
              style={{ marginBlockStart: '4px' }}
            >
              {t('form.arrival.timezone', {
                destination: 'Bangkok',
              })}
            </Text>
          </InputGroup>
        </InputFormGroup>
      </Card>

      <FormActionGroup>
        <ButtonGroup>
          <WePriceMatch />

          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              {/* Submit Form Button */}
              <Button
                $color="blue"
                $size="md"
                disabled={updateBookingDetailsMutation.isPending}
                endIcon={ChevronRight}
                loading={updateBookingDetailsMutation.isPending}
                style={{ padding: '14px 26px' }}
                type="submit"
              >
                {t('form.cta')}
              </Button>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content align="end" side="top" sideOffset={8}>
                <Heading $size="xl" $weight="bold" as="h3">
                  {property?.name}
                </Heading>
                <Text $size="sm" $weight="bold">
                  {booking?.rooms.map((room) => room.name).join(', ')}
                </Text>
                <hr
                  style={{
                    marginTop: '8px',
                  }}
                />
                <DateCheckInOutSummary
                  style={{
                    marginTop: '8px',
                  }}
                >
                  <CheckInOutItem dateTime="Wed, Jun 18, 2025">
                    <Heading
                      $size="sm"
                      $weight="normal"
                      as="h3"
                      style={{ marginBlockEnd: '8px' }}
                    >
                      {t('booking.dates.checkIn')}
                    </Heading>
                    <Text
                      $weight="bold"
                      as="div"
                      style={{ marginBlockEnd: '4px' }}
                    >
                      {booking?.checkIn
                        ? formatLocalizedDateString(
                            booking.checkIn,
                            currentLanguage as Language,
                            'full',
                          )
                        : null}
                    </Text>
                    <Text $color="description" $size="sm" as="div">
                      2:00 PM - 7:00 PM
                    </Text>
                  </CheckInOutItem>
                  <div>
                    <Separator style={{ height: '100%', width: '1px' }} />
                  </div>
                  <CheckInOutItem dateTime="Fri, Jun 20, 2025">
                    <Heading
                      $size="sm"
                      $weight="normal"
                      as="h3"
                      style={{ marginBlockEnd: '8px' }}
                    >
                      {t('booking.dates.checkOut')}
                    </Heading>
                    <Text
                      $weight="bold"
                      as="div"
                      style={{ marginBlockEnd: '4px' }}
                    >
                      {booking?.checkOut
                        ? formatLocalizedDateString(
                            booking.checkOut,
                            currentLanguage as Language,
                            'full',
                          )
                        : null}
                    </Text>
                    <Text $color="description" $size="sm" as="div">
                      11:00 AM - 11:00 AM
                    </Text>
                  </CheckInOutItem>
                </DateCheckInOutSummary>
                <div
                  style={{
                    marginTop: '8px',
                  }}
                >
                  <Text $size="sm" as="div">
                    {t('booking.dates.lengthOfStay')}:
                  </Text>
                  <Text
                    $size="sm"
                    $weight="bold"
                    as="div"
                    style={{
                      marginTop: '4px',
                    }}
                  >
                    {t('booking.dates.nights', {
                      count: booking?.nights,
                    })}
                  </Text>
                </div>
                <HoverCard.Arrow height={8} width={12} />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        </ButtonGroup>
      </FormActionGroup>
    </form>
  );
};
