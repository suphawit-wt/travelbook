// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { GeniusBanner } from '@/entities/banner/ui/genius-banner';
import { MobileReviews } from '@/features/reviews/ui/mobile/mobile-reviews';

import { FoodAndDrink } from '../food-and-drink/food-and-drink';
import { MobileAvailability } from '../mobile-availability/mobile-availability';
import { MobileBreadcrumbs } from '../mobile-breadcrumbs/mobile-breadcrumbs';
import { MobileFacilities } from '../mobile-facilities';
import { MobileHouseRules } from '../mobile-house-rules/mobile-house-rules';
import { MobilePropertyHighlight } from '../mobile-property-highlight';
import { PropertyDescription } from '../property-description/property-description';
import { PropertyQAndA } from '../property-q-and-a/property-q-and-a';
import { ReserveCTA } from '../reserve-cta';
import { SearchCheckInOverview } from '../search-check-in-overview';

import { Wrapper } from './mobile-property-content.styled';

import type { MobilePropertyContentProps } from './mobile-property-content.types';
import type { FC } from 'react';

export const MobilePropertyContent: FC<MobilePropertyContentProps> = ({
  propertyDetails,
  searchQuery,
  nights,
}) => {
  return (
    <Wrapper>
      <MobilePropertyHighlight />
      <SearchCheckInOverview nights={nights} searchQuery={searchQuery} />
      <ReserveCTA nights={nights} />
      <GeniusBanner />
      <MobileFacilities />
      <MobileReviews reviews={propertyDetails?.reviews ?? []} />
      <MobileAvailability
        nights={nights}
        rooms={propertyDetails?.rooms ?? []}
      />
      <FoodAndDrink />
      <PropertyQAndA />
      <PropertyDescription />
      <MobileHouseRules />
      <MobileBreadcrumbs propertyName={propertyDetails?.name} />
    </Wrapper>
  );
};
