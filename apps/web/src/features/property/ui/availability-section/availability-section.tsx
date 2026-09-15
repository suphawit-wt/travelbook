// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useMutation } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import {
  AlarmClock,
  BedDouble,
  Check,
  Clock9,
  Coffee,
  CreditCard,
  Fence,
  Flower2,
  Grid2X2,
  Martini,
  ShowerHead,
  Snowflake,
  Tag,
  TreePine,
  Tv2,
  UserRound,
  Waves,
  Wifi,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';

import { WePriceMatch } from '@/entities/property/ui/we-price-match/we-price-match';
import { BookingService } from '@/features/booking/lib/booking.service';
import type { CreateBookingRequest } from '@/features/booking/lib/booking.service.types';
import {
  selectBooking,
  selectBookingSummary,
  selectSelectedRooms,
} from '@/features/booking/store/booking.selectors';
import {
  setBookingMeta,
  setRoomQuantity,
} from '@/features/booking/store/booking.slice';
import { AvailabilitySearch } from '@/features/search/ui/availability-search';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import type { Language } from '@/shared/types/store';
import {
  Button,
  Card,
  Heading,
  Icon,
  Link,
  Separator,
  Table,
  Text,
} from '@/shared/ui';
import { formatLocalizedDate } from '@/shared/utils/date';

import {
  AvailabilityFooter,
  AvailabilityGroup,
  AvailabilityTitle,
  ChoicesGroup,
  FacilityInfoGroup,
  FakeTableHeader,
  ReservationSummary,
  ReservationTable,
  ReserveSummaryContent,
  TableHeaderPrice,
  TableHeaderPriceArrow,
} from './availability-section.styled';

import type {
  AmenityItem,
  AvailabilitySectionProps,
  FacilityInfoItem,
} from './availability.types';
import type { FC } from 'react';

export const AvailabilitySection: FC<AvailabilitySectionProps> = ({
  propertyId,
  rooms,
  searchQuery,
  nights,
}) => {
  const bookingService = new BookingService(axiosClient);

  const router = useRouter();
  const { t, i18n } = useTranslation(['property', 'booking']);
  const dispatch = useAppDispatch();
  const booking = useAppSelector(selectBooking);
  const selectedRooms = useAppSelector(selectSelectedRooms);
  const { total, totalRooms } = useAppSelector(selectBookingSummary);
  const currency = useAppSelector(selectCurrency);
  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const cancelBeforeDate = addDays(new Date(), 7);
  const freeCancelShortDate = formatLocalizedDate(
    cancelBeforeDate,
    currentLanguage as Language,
    'short',
  );

  const facilityInfoItems: FacilityInfoItem[] = [
    { id: 'size', icon: Grid2X2, label: '72 m²' },
    { id: 'private-pool', icon: Waves, label: 'Private pool' },
    { id: 'balcony', icon: Fence, label: 'Balcony' },
    { id: 'garden-view', icon: Flower2, label: 'Garden view' },
    { id: 'pool-view', icon: Waves, label: 'Pool view' },
    { id: 'courtyard-view', icon: TreePine, label: 'Inner courtyard view' },
    { id: 'ac', icon: Snowflake, label: 'Air conditioning' },
    { id: 'patio', icon: Fence, label: 'Patio' },
    { id: 'bathroom', icon: ShowerHead, label: 'Attached bathroom' },
    { id: 'tv', icon: Tv2, label: 'Flat-screen TV' },
    { id: 'terrace', icon: Fence, label: 'Terrace' },
    { id: 'coffee', icon: Coffee, label: 'Coffee machine' },
    { id: 'minibar', icon: Martini, label: 'Minibar' },
    { id: 'wifi', icon: Wifi, label: 'Free Wifi' },
  ];

  const amenityItems: AmenityItem[] = [
    { id: 'hot-tub', label: 'Hot tub' },
    { id: 'free-toiletries', label: 'Free toiletries' },
    { id: 'bathrobe', label: 'Bathrobe' },
    { id: 'toilet', label: 'Toilet' },
    { id: 'sofa', label: 'Sofa' },
    { id: 'bathtub-or-shower', label: 'Bathtub or shower' },
    { id: 'towels', label: 'Towels' },
    { id: 'linens', label: 'Linens' },
    { id: 'socket', label: 'Socket near the bed' },
    { id: 'desk', label: 'Desk' },
    { id: 'sitting-area', label: 'Sitting area' },
    { id: 'private-entrance', label: 'Private entrance' },
    { id: 'tv', label: 'TV' },
    { id: 'slippers', label: 'Slippers' },
    { id: 'refrigerator', label: 'Refrigerator' },
    { id: 'tea-coffee', label: 'Tea/Coffee maker' },
    { id: 'iron', label: 'Iron' },
    { id: 'hairdryer', label: 'Hairdryer' },
    { id: 'fan', label: 'Fan' },
    { id: 'closet', label: 'Walk-in closet' },
    { id: 'carpeted', label: 'Carpeted' },
    { id: 'kettle', label: 'Electric kettle' },
    { id: 'outdoor-dining', label: 'Outdoor dining area' },
    { id: 'dining-area', label: 'Dining area' },
    { id: 'ground-floor', label: 'Entire unit located on ground floor' },
    { id: 'clothes-rack', label: 'Clothes rack' },
    { id: 'drying-rack', label: 'Drying rack for clothing' },
    { id: 'toilet-paper', label: 'Toilet paper' },
    { id: 'sofa-bed', label: 'Sofa bed' },
  ];

  const destination = 'Bangkok';
  const unavailableHotelCount = 11;

  const createBookingMutation = useMutation({
    mutationFn: (req: CreateBookingRequest) =>
      bookingService.createBooking(req, currency),

    onSuccess: (res) => {
      const bookingId = res.bookingId;

      router.push(`/booking/${bookingId}`);
    },

    onError: (err: unknown) => {
      // eslint-disable-next-line no-console -- for debug
      console.error(err);
    },
  });

  const handleReserve = () => {
    const selectedRooms = Object.values(booking.selectedRooms);

    if (selectedRooms.length === 0) return;

    const req: CreateBookingRequest = {
      propertyId: booking.propertyId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      rooms: selectedRooms.map((r) => ({
        roomTypeId: r.roomTypeId,
        ratePlanId: r.ratePlanId,
        quantity: r.quantity,
      })),
      guests: booking.guests,
    };

    createBookingMutation.mutate(req);
  };

  useEffect(() => {
    dispatch(
      setBookingMeta({
        propertyId,
        checkIn: searchQuery.checkIn,
        checkOut: searchQuery.checkOut,
        guests: {
          adults: searchQuery.adult,
          children: searchQuery.children,
        },
      }),
    );
  }, [propertyId, searchQuery, dispatch]);

  return (
    <AvailabilityGroup id="availability">
      <AvailabilityTitle>
        <Heading $size="2xl" as="h2">
          {t('availability.title')}
        </Heading>

        <WePriceMatch />
      </AvailabilityTitle>
      <AvailabilitySearch searchQuery={searchQuery} />
      <ReservationTable>
        <Table.Root>
          <Table.Header style={{ width: '888px' }}>
            <Table.Row>
              <Table.HeaderCell style={{ width: '234px' }}>
                {t('availability.table.header.roomType')}
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: '113px' }}>
                {t('availability.table.header.guests')}
              </Table.HeaderCell>
              <TableHeaderPrice style={{ width: '156px' }}>
                {t('availability.table.header.price', { nights })}
                <TableHeaderPriceArrow />
              </TableHeaderPrice>
              <Table.HeaderCell style={{ width: '246px' }}>
                {t('availability.table.header.choices')}
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: '45px', whiteSpace: 'normal' }}>
                {t('availability.table.header.selectRooms')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <React.Fragment key={room.roomId}>
                  <Table.Row>
                    <Table.HeaderCell rowSpan={room.ratePlans.length}>
                      <Link $color="blue" $underline="always" href="hotels/">
                        {room.name}
                      </Link>
                      <Text
                        $color="green"
                        $iconSize="xs"
                        $size="xs"
                        $weight="bold"
                        startIcon={Clock9}
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                      >
                        Only 3 rooms left on our site
                      </Text>
                      <Text $size="sm" $weight="normal">
                        <Text style={{ marginRight: '10px' }}>
                          {room.bedInfo} bed
                        </Text>
                        <Icon $size="lg" icon={BedDouble} />
                      </Text>
                      <FacilityInfoGroup>
                        {facilityInfoItems.map(({ id, icon, label }) => (
                          <Text
                            key={id}
                            $iconSize="xs"
                            $size="xs"
                            $weight="normal"
                            startIcon={icon}
                          >
                            {label}
                          </Text>
                        ))}
                      </FacilityInfoGroup>
                      <Separator />
                      <FacilityInfoGroup>
                        {amenityItems.map(({ id, label }) => (
                          <Text
                            key={id}
                            $iconColor="green"
                            $iconSize="xs"
                            $size="xs"
                            $weight="normal"
                            startIcon={Check}
                          >
                            {label}
                          </Text>
                        ))}
                      </FacilityInfoGroup>
                    </Table.HeaderCell>

                    {room.ratePlans[0] ? (
                      <React.Fragment key={room.ratePlans[0].id}>
                        <Table.Cell>
                          {Array.from(
                            { length: room.ratePlans[0].maxGuest },
                            (_, i) => (
                              <UserRound key={i} size={14} />
                            ),
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Text $weight="bold">
                            {t(`price.${currency}`, {
                              amount: room.ratePlans[0].price,
                            })}
                          </Text>
                          <Text $color="description" $size="xs" as="p">
                            {t('card.pricing.includesTaxes')}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <ChoicesGroup>
                            <Text
                              $color="green"
                              $iconSize="xs"
                              $size="xs"
                              startIcon={Check}
                            >
                              {t('booking.cancellation.freeBefore', {
                                date: freeCancelShortDate,
                                ns: 'booking',
                              })}
                            </Text>
                            <Text
                              $iconSize="xs"
                              $size="xs"
                              startIcon={CreditCard}
                            >
                              {t('payment.methods.online', {
                                ns: 'booking',
                              })}
                            </Text>
                            <Text
                              $iconColor="blue"
                              $iconSize="xs"
                              $size="xs"
                              startIcon={Tag}
                            >
                              Genius discount may be available
                            </Text>
                          </ChoicesGroup>
                        </Table.Cell>
                        <Table.Cell>
                          <select
                            value={
                              selectedRooms[room.ratePlans[0].id]?.quantity ?? 0
                            }
                            onChange={(e) => {
                              const quantity = Number(e.target.value);

                              dispatch(
                                setRoomQuantity({
                                  roomTypeId: room.roomId,
                                  ratePlanId: room.ratePlans[0].id,
                                  quantity,
                                  price: room.ratePlans[0].price,
                                }),
                              );
                            }}
                          >
                            {Array.from(
                              { length: room.availableRooms + 1 },
                              (_, i) => (
                                <option key={i} value={i}>
                                  {i}
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  {i > 0 &&
                                    `(${
                                      t(`price.${currency}`, {
                                        amount: room.ratePlans[0].price * i,
                                      }) as string
                                    })`}
                                </option>
                              ),
                            )}
                          </select>
                        </Table.Cell>
                      </React.Fragment>
                    ) : null}
                  </Table.Row>

                  {room.ratePlans.slice(1).map((plan) => (
                    <Table.Row key={plan.id}>
                      <Table.Cell>
                        {Array.from({ length: plan.maxGuest }, (_, i) => (
                          <UserRound key={i} size={14} />
                        ))}
                      </Table.Cell>
                      <Table.Cell>
                        <Text $weight="bold">
                          {t(`price.${currency}`, { amount: plan.price })}
                        </Text>
                        <Text $color="description" $size="xs" as="p">
                          {t('card.pricing.includesTaxes')}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <ChoicesGroup>
                          <Text
                            $color="green"
                            $iconSize="xs"
                            $size="xs"
                            startIcon={Check}
                          >
                            {t('booking.cancellation.freeBefore', {
                              date: freeCancelShortDate,
                              ns: 'booking',
                            })}
                          </Text>
                          <Text
                            $iconSize="xs"
                            $size="xs"
                            startIcon={CreditCard}
                          >
                            {t('payment.methods.online', {
                              ns: 'booking',
                            })}
                          </Text>
                          <Text
                            $iconColor="blue"
                            $iconSize="xs"
                            $size="xs"
                            startIcon={Tag}
                          >
                            Genius discount may be available
                          </Text>
                        </ChoicesGroup>
                      </Table.Cell>
                      <Table.Cell>
                        <select
                          value={selectedRooms[plan.id]?.quantity ?? 0}
                          onChange={(e) => {
                            const quantity = Number(e.target.value);

                            dispatch(
                              setRoomQuantity({
                                roomTypeId: room.roomId,
                                ratePlanId: plan.id,
                                quantity,
                                price: plan.price,
                              }),
                            );
                          }}
                        >
                          {Array.from(
                            { length: room.availableRooms + 1 },
                            (_, i) => (
                              <option key={i} value={i}>
                                {i}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {i > 0 &&
                                  `     (${
                                    t(`price.${currency}`, {
                                      amount: plan.price * i,
                                    }) as string
                                  })`}
                              </option>
                            ),
                          )}
                        </select>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Text $size="md" $weight="bold">
                    {t('availability.noRoomsAvailable')}
                  </Text>
                  &nbsp;
                  <Text $color="description" $size="sm">
                    {t('availability.changeDatesAndGuests')}
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        <ReservationSummary>
          <FakeTableHeader />
          <ReserveSummaryContent>
            {totalRooms > 0 && (
              <>
                <Text $size="sm" style={{ marginBottom: '6px' }}>
                  {t('availability.table.summary.roomFor', {
                    count: totalRooms,
                  })}
                </Text>
                <Text $size="lg" style={{ marginBottom: '2px' }}>
                  {t(`price.${currency}`, {
                    amount: total,
                  })}
                </Text>
                <Text
                  $color="description"
                  $size="xs"
                  as="p"
                  style={{ marginBottom: '16px' }}
                >
                  {t('card.pricing.includesTaxes')}
                </Text>
              </>
            )}
            <Button
              $color="blue"
              disabled={createBookingMutation.isPending}
              onClick={handleReserve}
            >
              {createBookingMutation.isPending
                ? t('availability.table.summary.pending')
                : t('availability.table.summary.reserve')}
            </Button>
            <Text $size="sm">
              {t('availability.table.summary.noChargeYet')}
            </Text>
          </ReserveSummaryContent>
        </ReservationSummary>
      </ReservationTable>

      <Card.Root $padding="md" $variant="surface" style={{ marginTop: '20px' }}>
        <Text
          $iconColor="green"
          $iconSize="lg"
          $size="sm"
          startIcon={AlarmClock}
        >
          <Trans
            i18nKey="availability.limitedSupply"
            t={t}
            values={{ destination, count: unavailableHotelCount }}
            components={[
              // eslint-disable-next-line react/jsx-key -- for translate
              <b />,
            ]}
          />
        </Text>
      </Card.Root>

      <AvailabilityFooter>
        <Button $color="blue" $size="sm">
          {t('availability.actions.seeAvailability')}
        </Button>
      </AvailabilityFooter>
    </AvailabilityGroup>
  );
};
