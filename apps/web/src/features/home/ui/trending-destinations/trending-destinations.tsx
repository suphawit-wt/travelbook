// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { DestinationCard } from '@/entities/property/ui/destination-card/destination-card';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Heading, Text } from '@/shared/ui';

import {
  ContentFirstRow,
  ContentSecondRow,
  Wrapper,
} from './trending-destinations.styled';

import type { TrendingDestinationsProps } from './trending-destinations.types';
import type { FC } from 'react';

export const TrendingDestinations: FC<TrendingDestinationsProps> = async ({
  destinations,
}) => {
  const { t } = await getTranslation('home');

  return (
    <Wrapper $showOnly="desktop">
      <Heading $size="2xl" as="h2">
        {t('trendingDestinations.heading')}
      </Heading>
      <Text $color="description" as="p" style={{ marginTop: '6px' }}>
        {t('trendingDestinations.description')}
      </Text>
      <ContentFirstRow>
        {destinations.slice(0, 2).map((destination) => (
          <DestinationCard
            key={destination.id}
            country={destination.country}
            image={destination.image}
            name={destination.name}
          />
        ))}
      </ContentFirstRow>
      <ContentSecondRow>
        {destinations.slice(2, 5).map((destination) => (
          <DestinationCard
            key={destination.id}
            country={destination.country}
            image={destination.image}
            name={destination.name}
          />
        ))}
      </ContentSecondRow>
    </Wrapper>
  );
};
