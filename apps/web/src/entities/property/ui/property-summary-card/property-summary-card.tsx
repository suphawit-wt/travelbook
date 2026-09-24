// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Wifi } from 'lucide-react';

import { ReviewInfo } from '@/entities/reviews/ui/review-info/review-info';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Skeleton, StarRating, Text } from '@/shared/ui';

import { Card, PropertyRate } from './property-summary-card.styled';

import type { PropertySummaryCardProps } from './property-summary-card.types';
import type { FC } from 'react';

export const PropertySummaryCard: FC<PropertySummaryCardProps> = ({
  name,
  type,
  countryCode,
  area,
  zipCode,
  rating,
  reviewCount,
}) => {
  const { t } = useTranslation(['property', 'facilities', 'country']);

  return (
    <Card>
      <PropertyRate>
        <Text $size="xs">{t(`type.${type}`)}</Text>
        <StarRating count={3} size="xs" />
      </PropertyRate>
      <Text $weight="bold">
        {name ? name : <Skeleton height="22px" width="190px" />}
      </Text>
      <Text $size="sm" as="div" style={{ marginTop: '14px' }}>
        {zipCode && area && countryCode ? (
          <>
            {zipCode}&nbsp;{area},&nbsp;
            {t(countryCode, {
              ns: 'country',
            })}
          </>
        ) : (
          <Skeleton height="16px" width="240px" />
        )}
      </Text>
      <Text $color="green" $size="xs" as="div" style={{ margin: '4px 0' }}>
        Great Location — 8.5
      </Text>
      <ReviewInfo
        $size="xs"
        rating={rating}
        reviews={reviewCount}
        style={{ margin: '10px 0' }}
        variants="landscape"
      />
      <Text $size="xs" as="div" startIcon={Wifi} style={{ marginTop: '10px' }}>
        {t('internet.free', { ns: 'facilities' })}
      </Text>
    </Card>
  );
};
