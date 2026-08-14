// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Heart, MapPin, Share2 } from 'lucide-react';

import { WePriceMatch } from '@/entities/property/ui/we-price-match/we-price-match';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Heading,
  Icon,
  IconButton,
  Link,
  Skeleton,
  StarRating,
  Text,
} from '@/shared/ui';

import {
  ActionGroup,
  AddressGroup,
  DetailGroup,
  HotelPageTop,
} from './property-overview.styled';

import type { PropertyOverviewProps } from './property-overview.types';
import type { FC } from 'react';

export const PropertyOverview: FC<PropertyOverviewProps> = ({
  propertyDetails,
}) => {
  const { t } = useTranslation(['property', 'country', 'common']);

  return (
    <HotelPageTop>
      <DetailGroup>
        <StarRating count={3} />
        <Heading $size="2xl" $weight="bold" as="h2">
          {propertyDetails?.name ? (
            propertyDetails.name
          ) : (
            <Skeleton height="24px" width="230px" />
          )}
        </Heading>
        <AddressGroup>
          <Icon $color="blue" $size="lg" icon={MapPin} />
          <Text $size="sm">
            {propertyDetails?.zipCode &&
            propertyDetails.area &&
            propertyDetails.countryCode &&
            propertyDetails.city ? (
              <>
                {propertyDetails.zipCode}&nbsp;{propertyDetails.area},&nbsp;
                {propertyDetails.city},&nbsp;
                {t(propertyDetails.countryCode, {
                  ns: 'country',
                })}
              </>
            ) : (
              <Skeleton height="16px" width="260px" />
            )}
          </Text>
          &nbsp;&ndash;&nbsp;
          <Link
            $color="blue"
            $size="sm"
            $underline="hover"
            $weight="bold"
            href="/"
          >
            {t('overview.location.greatWithMap')}
          </Link>
        </AddressGroup>
      </DetailGroup>

      <ActionGroup>
        <div>
          <IconButton
            $color="blue"
            $variant="ghost"
            icon={Heart}
            tooltip={t('actions.save', { ns: 'common' })}
          />
          <IconButton
            $color="blue"
            $variant="ghost"
            icon={Share2}
            tooltip={t('overview.actions.share')}
          />
          <Button $color="blue" $size="sm">
            {t('overview.actions.reserve')}
          </Button>
        </div>

        <WePriceMatch />
      </ActionGroup>
    </HotelPageTop>
  );
};
