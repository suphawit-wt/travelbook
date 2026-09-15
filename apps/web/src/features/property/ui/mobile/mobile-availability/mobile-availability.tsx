// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Bath,
  BedDouble,
  CreditCard,
  Fence,
  Flower2,
  Grid2X2,
  Image,
  RefreshCwOff,
  ShowerHead,
  Snowflake,
  UserRound,
  Waves,
  Wifi,
} from 'lucide-react';

import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Heading, Icon, Text } from '@/shared/ui';

import {
  AvailabilityCard,
  AvailabilityGroup,
  AvailabilityLabel,
  CardContent,
  ContentBottom,
  FacilityGroup,
  FacilityTag,
  PriceInfo,
  TitleButton,
  Wrapper,
} from './mobile-availability.styled';

import type { FC } from 'react';
import type { Room } from '@/features/property/lib/property.service.types';
import type { FacilityInfoItem } from '../../availability-section/availability.types';

interface MobileAvailabilityProps {
  nights: number;
  rooms: Room[];
}

export const MobileAvailability: FC<MobileAvailabilityProps> = ({
  nights,
  rooms,
}) => {
  const { t } = useTranslation(['property', 'booking']);
  const currency = useAppSelector(selectCurrency);

  const facilityInfoItems: FacilityInfoItem[] = [
    { id: 'size', icon: Grid2X2, label: '72 m²' },
    { id: 'bathroom', icon: ShowerHead, label: 'Attached bathroom' },
    { id: 'ac', icon: Snowflake, label: 'Air conditioning' },
    { id: 'hot-tub', icon: Bath, label: 'Hot tub' },
    { id: 'private-pool', icon: Waves, label: 'Private pool' },
    { id: 'balcony', icon: Fence, label: 'Balcony' },
    { id: 'garden-view', icon: Flower2, label: 'Garden view' },
    { id: 'pool-view', icon: Waves, label: 'Pool view' },
    { id: 'wifi', icon: Wifi, label: 'Free Wifi' },
  ];

  return (
    <Wrapper>
      <Text $size="sm">{rooms.length} results</Text>
      <AvailabilityGroup>
        {rooms.map((room) => {
          const primaryPlan = room.ratePlans[0];
          const maxGuest = primaryPlan?.maxGuest ?? 2;
          const price = primaryPlan?.price ?? 0;

          return (
            <AvailabilityCard key={room.roomId}>
              <CardContent>
                <TitleButton>
                  <Heading
                    $color="blue"
                    $size="md"
                    $underline="always"
                    $weight="bold"
                    as="h2"
                  >
                    {room.name}
                  </Heading>
                  <Icon $color="blue" $size="lg" icon={Image} />
                </TitleButton>

                <AvailabilityLabel>
                  <Text $size="sm">Price for:</Text>
                  <span>
                    {Array.from({ length: maxGuest }, (_, i) => (
                      <Icon key={i} $size="sm" icon={UserRound} />
                    ))}
                  </span>
                </AvailabilityLabel>

                <AvailabilityLabel>
                  <Text $size="sm">
                    <b>Bed:</b> {room.bedInfo} bed
                  </Text>
                  <Icon icon={BedDouble} />
                </AvailabilityLabel>

                <FacilityGroup>
                  {facilityInfoItems.map(({ id, icon, label }) => (
                    <FacilityTag key={id}>
                      <Icon $size="sm" icon={icon} />
                      <Text $size="xs">{label}</Text>
                    </FacilityTag>
                  ))}
                </FacilityGroup>

                <Text
                  $iconSize="sm"
                  $size="sm"
                  $weight="bold"
                  startIcon={RefreshCwOff}
                >
                  Non-refundable
                </Text>
                <Text
                  $iconSize="sm"
                  $size="sm"
                  $weight="bold"
                  startIcon={CreditCard}
                >
                  {t('payment.methods.online', { ns: 'booking' })}
                </Text>
              </CardContent>

              <ContentBottom>
                <PriceInfo>
                  <Text $size="sm">
                    <b>{t('availability.table.header.price', { nights })}:</b>
                  </Text>
                  <div>
                    <Text
                      $color="red"
                      style={{ textDecoration: 'line-through' }}
                    >
                      {t(`price.${currency}`, { amount: price })}
                    </Text>
                    <Text
                      $size="lg"
                      $weight="bold"
                      style={{ marginInlineStart: '4px' }}
                    >
                      {t(`price.${currency}`, { amount: price })}
                    </Text>
                  </div>
                  <Text $color="description" $size="xs" as="div">
                    {t('card.pricing.includesTaxes')}
                  </Text>
                </PriceInfo>
                <Button $color="blue" $variant="outline">
                  {t('availability.table.summary.reserve')}
                </Button>
              </ContentBottom>
            </AvailabilityCard>
          );
        })}
      </AvailabilityGroup>
    </Wrapper>
  );
};
