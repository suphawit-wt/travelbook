// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Card, Link, Text } from '@/shared/ui';

import type { DestinationCardProps } from './destination-card.types';
import type { FC } from 'react';

export const DestinationCard: FC<DestinationCardProps> = ({
  name,
  image,
  country,
}) => {
  return (
    <Link href={`search?dest=${name}`}>
      <Card.Root
        $variant="surface"
        style={{
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Card.Content $padding="lg">
          <Text
            $color="white"
            $shadow="md"
            $size="2xl"
            $weight="bold"
            as="span"
          >
            {name}&nbsp;{country}
          </Text>
        </Card.Content>
        <Card.ImageOverlay />
        <Card.Image alt={name} height={500} src={image} width={500} />
      </Card.Root>
    </Link>
  );
};
