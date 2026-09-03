// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Button, Heading, Text } from '@/shared/ui';

import { TitleGroup, Wrapper } from './property-description.styled';

export const PropertyDescription = () => {
  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="xl" $weight="bold" as="h2">
          Property Description
        </Heading>
      </TitleGroup>
      <Text $size="sm" as="p" style={{ marginBottom: '16px' }}>
        <b>Comfortable Accommodations:</b> Malaya Villa Kohlarn in Nakhon Chai
        Si offers comfortable rooms with air-conditioning, private bathrooms,
        and modern amenities. Guests enjoy free WiFi, balconies with garden or
        pool views, and private...
      </Text>
      <Button
        $color="blue"
        $pressEffect="scale"
        $variant="ghost"
        style={{ padding: '0px' }}
      >
        Read more
      </Button>
    </Wrapper>
  );
};
