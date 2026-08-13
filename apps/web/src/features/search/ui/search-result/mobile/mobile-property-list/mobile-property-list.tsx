// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Check, MapPin } from 'lucide-react';

import { ReviewInfo } from '@/entities/reviews/ui/review-info';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Image, StarRating, Text } from '@/shared/ui';

import {
  CardContent,
  CardImageWrapper,
  PriceSection,
  PropertyItem,
  Wrapper,
} from './mobile-property-list.styled';

import type { MobilePropertyListProps } from './mobile-property-list.types';
import type { FC } from 'react';

export const MobilePropertyList: FC<MobilePropertyListProps> = ({
  properties,
  queryString,
  nights,
}) => {
  const { t } = useTranslation(['property', 'search', 'country', 'common']);

  const currency = useAppSelector(selectCurrency);
  return (
    <Wrapper>
      {properties.map(
        ({
          id,
          slug,
          name,
          image,
          area,
          countryCode,
          city,
          startingPrice,
          avgRating,
          reviewCount,
          room,
        }) => (
          <li key={id}>
            <PropertyItem href={`hotels/${slug}/?${queryString}`}>
              <CardImageWrapper>
                <Image fill alt="card" src={image} />
              </CardImageWrapper>
              <CardContent>
                <div>
                  <Text $size="sm" $weight="bold" as="div">
                    {name}
                  </Text>
                  <StarRating count={3} />
                  <ReviewInfo
                    $size="xs"
                    rating={avgRating}
                    reviews={reviewCount}
                    variants="landscape"
                  />
                  <Text
                    $iconSize="sm"
                    $size="xs"
                    as="div"
                    startIcon={MapPin}
                    style={{ marginTop: '8px' }}
                  >
                    {area},&nbsp;{city},&nbsp;
                    {t(countryCode, { ns: 'country' })}
                  </Text>
                </div>
                <PriceSection>
                  <Text $size="xs" $weight="bold" as="div">
                    {t('availability.table.header.price', { nights })}:
                  </Text>
                  <div>
                    <Text
                      $color="red"
                      style={{ textDecoration: 'line-through' }}
                    >
                      {t(`price.${currency}`, {
                        amount: startingPrice,
                        ns: 'common',
                      })}
                    </Text>
                    <Text
                      $size="lg"
                      $weight="bold"
                      style={{ marginInlineStart: '4px' }}
                    >
                      {t(`price.${currency}`, {
                        amount: startingPrice,
                        ns: 'common',
                      })}
                    </Text>
                  </div>
                  <Text $color="description" $size="xs" as="div">
                    {t('card.pricing.includesTaxes', { ns: 'property' })}
                  </Text>
                  {room.breakfastIncluded ? (
                    <Text $color="green" $size="sm" $weight="bold" as="div">
                      {t('card.pricing.breakfastIncluded', { ns: 'property' })}
                    </Text>
                  ) : null}
                  <Text
                    $color="green"
                    $size="sm"
                    $weight="bold"
                    as="div"
                    startIcon={Check}
                  >
                    {t('filters.groups.policies.options.freeCancellation', {
                      ns: 'search',
                    })}
                  </Text>
                </PriceSection>
              </CardContent>
            </PropertyItem>
          </li>
        ),
      )}
    </Wrapper>
  );
};
