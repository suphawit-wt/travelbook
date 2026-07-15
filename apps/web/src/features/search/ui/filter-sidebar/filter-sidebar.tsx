// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Text } from '@/shared/ui';

import { AccessibilityFilter } from './components/accessibility-filter/accessibility-filter';
import { ActivitiesFilter } from './components/activities-filter/activities-filter';
import { BeachAccessFilter } from './components/beach-access-filter/beach-access-filter';
import { BedPreferenceFilter } from './components/bed-preference-filter/bed-preference-filter';
import { BudgetFilter } from './components/budget-filter/budget-filter';
import { CityFilter } from './components/city-filter/city-filter';
import { FacilitiesFilter } from './components/facilities-filter/facilities-filter';
import { HighlyRatedFeaturesFilter } from './components/highly-rated-features-filter/highly-rated-features-filter';
import { LandmarksFilter } from './components/landmarks-filter/landmarks-filter';
import { MealsFilter } from './components/meals-filter/meals-filter';
import { PaymentsFilter } from './components/payments-filter/payments-filter';
import { PoliciesFilter } from './components/policies-filter/policies-filter';
import { PopularFilters } from './components/popular-filter/popular-filter';
import { PropertyRatingFilter } from './components/property-rating-filter/property-rating-filter';
import { PropertyTypeFilter } from './components/property-type-filter/property-type-filter';
import { ReviewScoreFilter } from './components/review-score-filter/review-score-filter';
import { RoomFacilitiesFilter } from './components/room-facilities-filter/room-facilities-filter';
import { RoomsFilter } from './components/rooms-filter/rooms-filter';
import { Group, Wrapper } from './filter-sidebar.styled';

export const FilterSidebar = async () => {
  const { t } = await getTranslation('search');

  return (
    <Wrapper>
      <Group>
        <Text $weight="bold">{t('filters.title')}:</Text>
      </Group>
      <BudgetFilter />
      <PopularFilters />
      <MealsFilter />
      <FacilitiesFilter />
      <PropertyTypeFilter />
      <RoomsFilter />
      <ReviewScoreFilter />
      <RoomFacilitiesFilter />
      <PropertyRatingFilter />
      <BeachAccessFilter />
      <PoliciesFilter />
      <ActivitiesFilter />
      <BedPreferenceFilter />
      <CityFilter />
      <HighlyRatedFeaturesFilter />
      <PaymentsFilter />
      <LandmarksFilter />
      <AccessibilityFilter />
    </Wrapper>
  );
};
