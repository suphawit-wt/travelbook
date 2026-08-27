// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { MobilePropertyHighlight } from '../mobile-property-highlight';
import { ReserveCTA } from '../reserve-cta';
import { SearchCheckInOverview } from '../search-check-in-overview';

import { Wrapper } from './mobile-property-content.styled';

import type { MobilePropertyContentProps } from './mobile-property-content.types';
import type { FC } from 'react';

export const MobilePropertyContent: FC<MobilePropertyContentProps> = ({
  searchQuery,
  nights,
}) => {
  return (
    <Wrapper>
      <MobilePropertyHighlight />
      <SearchCheckInOverview nights={nights} searchQuery={searchQuery} />
      <ReserveCTA nights={nights} />
    </Wrapper>
  );
};
