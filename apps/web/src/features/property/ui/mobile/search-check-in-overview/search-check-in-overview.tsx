// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { Button, Heading, Separator, Text } from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import {
  CheckInOutItem,
  DateCheckInOutSummary,
  Header,
  Wrapper,
} from './search-check-in-overview.styled';

import type { SearchCheckInOverviewProps } from './search-check-in-overview.types';
import type { FC } from 'react';

export const SearchCheckInOverview: FC<SearchCheckInOverviewProps> = ({
  searchQuery,
  nights,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? 'en';
  const checkInFormatted = formatLocalizedDateString(
    searchQuery.checkIn,
    currentLanguage as Language,
    'full',
  );
  const checkOutFormatted = formatLocalizedDateString(
    searchQuery.checkOut,
    currentLanguage as Language,
    'full',
  );

  return (
    <Wrapper>
      <Header>
        <Text $size="sm">
          Your Search: {searchQuery.adult} adults, {nights} nights
        </Text>
        <Button $color="blue" $size="sm" $variant="link">
          Edit
        </Button>
      </Header>
      <DateCheckInOutSummary>
        <CheckInOutItem dateTime={checkInFormatted}>
          <Heading
            $size="sm"
            $weight="normal"
            as="h3"
            style={{ marginBlockEnd: '8px' }}
          >
            Check-in
          </Heading>
          <Text
            $color="blue"
            $weight="bold"
            as="div"
            style={{ marginBlockEnd: '4px' }}
          >
            {checkInFormatted}
          </Text>
          <Text $color="description" $size="sm" as="div">
            2:00 PM - 7:00 PM
          </Text>
        </CheckInOutItem>
        <div>
          <Separator style={{ height: '100%', width: '1px' }} />
        </div>
        <CheckInOutItem dateTime={checkOutFormatted}>
          <Heading
            $size="sm"
            $weight="normal"
            as="h3"
            style={{ marginBlockEnd: '8px' }}
          >
            Check-out
          </Heading>
          <Text
            $color="blue"
            $weight="bold"
            as="div"
            style={{ marginBlockEnd: '4px' }}
          >
            {checkOutFormatted}
          </Text>
          <Text $color="description" $size="sm" as="div">
            11:00 AM - 11:00 AM
          </Text>
        </CheckInOutItem>
      </DateCheckInOutSummary>
    </Wrapper>
  );
};
