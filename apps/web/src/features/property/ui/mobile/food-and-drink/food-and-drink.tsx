// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Utensils } from 'lucide-react';

import { Button, Heading, Icon, Text } from '@/shared/ui';

import { TitleGroup, Wrapper } from './food-and-drink.styled';

export const FoodAndDrink = () => {
  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="xl" $weight="bold" as="h2">
          Food & Drink
        </Heading>
        <Icon $size="lg" icon={Utensils} />
      </TitleGroup>
      <Text $size="sm" as="p" style={{ marginBottom: '16px' }}>
        Find out what food and drink options you could be enjoying at this
        property
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
