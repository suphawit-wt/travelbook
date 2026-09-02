// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Coffee, ParkingCircle, Waves, Wifi } from 'lucide-react';

import { Button, Heading, Text } from '@/shared/ui';

import { FacilityList, Wrapper } from './mobile-facilities.styled';

export const MobileFacilities = () => {
  return (
    <Wrapper>
      <Heading
        $size="xl"
        $weight="bold"
        as="h2"
        style={{ marginBottom: '16px' }}
      >
        Facilities
      </Heading>
      <FacilityList>
        <li>
          <Text $size="sm" startIcon={Waves}>
            Outdoor swimming pool
          </Text>
        </li>
        <li>
          <Text $size="sm" startIcon={ParkingCircle}>
            Free parking
          </Text>
        </li>
        <li>
          <Text $size="sm" startIcon={Wifi}>
            Free Wifi
          </Text>
        </li>
        <li>
          <Text $size="sm" startIcon={Coffee}>
            Breakfast
          </Text>
        </li>
      </FacilityList>
      <Button $color="blue" $pressEffect="scale" $variant="ghost">
        Show all facilities and services
      </Button>
    </Wrapper>
  );
};
