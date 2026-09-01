// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  FerrisWheel,
  Footprints,
  PlaneTakeoff,
  Sailboat,
  TentTree,
  Train,
  Utensils,
} from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, ButtonLink, Heading, Text } from '@/shared/ui';

import {
  AreaGroup,
  AreaItem,
  AreaItemList,
  AreaType,
  NearbyAreaGroup,
  TitleGroup,
  Wrapper,
} from './hotel-area.styled';

import type { NearbyGroup } from './hotel-area.types';

export const HotelArea = () => {
  const { t } = useTranslation('property');

  const nearbyAreaGroups: NearbyGroup[] = [
    {
      id: 'nearby',
      title: t('area.categories.nearby'),
      icon: Footprints,
      items: [
        {
          id: 'na-baan-pier',
          name: 'Na Baan Pier',
          distance: t('units.distance.kilometers', { distance: 1.3 }),
        },
        {
          id: 'property-namtarn',
          name: 'Property Of Namtarn',
          distance: t('units.distance.kilometers', { distance: 9 }),
        },
        {
          id: 'pla-park',
          name: 'Pla Park',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'ripley',
          name: "Ripley's Believe It or Not",
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'gibbonsss',
          name: 'Flight Of The Gibbonsss',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'gibbon',
          name: 'Flight Of The Gibbon',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'fun-ball',
          name: 'Fun Ball Battle',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'central-festival',
          name: 'Playground Central Festival',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'thaithong',
          name: 'Playground Thaithong',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
        {
          id: 'art-in-paradise',
          name: 'Art In Paradise',
          distance: t('units.distance.kilometers', { distance: 10 }),
        },
      ],
    },
    {
      id: 'cafes',
      title: t('area.categories.restaurants'),
      icon: Utensils,
      items: [
        {
          id: 'baan-sailboat',
          name: 'Baan Sailboat Beach Kohlarn',
          type: t('area.labels.cafeBar'),
          distance: t('units.distance.meters', { distance: 400 }),
        },
        {
          id: 'anaconda-cafe',
          name: 'Anaconda Cafe Icecream',
          type: t('area.labels.cafeBar'),
          distance: t('units.distance.kilometers', { distance: 1.3 }),
        },
        {
          id: 'shop-nangtan',
          name: 'Shop Nangtan Koh Larn',
          type: t('area.labels.cafeBar'),
          distance: t('units.distance.kilometers', { distance: 1.3 }),
        },
      ],
    },
    {
      id: 'attractions',
      title: t('area.categories.attractions'),
      icon: FerrisWheel,
      items: [
        {
          id: 'underwater-world',
          name: 'Pattaya Underwater World',
          distance: t('units.distance.kilometers', { distance: 12 }),
        },
        {
          id: 'viewpoint',
          name: 'Pattaya Viewpoint',
          distance: t('units.distance.kilometers', { distance: 12 }),
        },
        {
          id: 'park-tower',
          name: 'Pattaya Park Tower',
          distance: t('units.distance.kilometers', { distance: 13 }),
        },
        {
          id: 'bottle-art',
          name: 'Bottle Art Musuem',
          distance: t('units.distance.kilometers', { distance: 13 }),
        },
        {
          id: 'mini-siam',
          name: 'Mini Siam',
          distance: t('units.distance.kilometers', { distance: 14 }),
        },
      ],
    },
    {
      id: 'natural',
      title: t('area.categories.nature'),
      icon: TentTree,
      items: [
        {
          id: 'pattaya-hill',
          name: 'Pattaya Hill',
          type: t('area.labels.peak'),
          distance: t('units.distance.kilometers', { distance: 12 }),
        },
      ],
    },
    {
      id: 'beaches',
      title: t('area.categories.beaches'),
      icon: Sailboat,
      items: [
        {
          id: 'samae-beach',
          name: 'Samae Beach',
          distance: t('units.distance.kilometers', { distance: 1.6 }),
        },
        {
          id: 'nual-beach',
          name: 'Nual Beach',
          distance: t('units.distance.kilometers', { distance: 1.6 }),
        },
        {
          id: 'tawaen-beach',
          name: 'Tawaen Beach',
          distance: t('units.distance.kilometers', { distance: 1.8 }),
        },
        {
          id: 'tien-beach',
          name: 'Tien Beach',
          distance: t('units.distance.kilometers', { distance: 1.8 }),
        },
        {
          id: 'thong-lang',
          name: 'Thong Lang Beach',
          distance: t('units.distance.kilometers', { distance: 2.2 }),
        },
      ],
    },
    {
      id: 'transit',
      title: t('area.categories.transport'),
      icon: Train,
      items: [
        {
          id: 'south-station',
          name: 'Pattaya South',
          type: t('area.labels.train'),
          distance: t('units.distance.kilometers', { distance: 12 }),
        },
        {
          id: 'bus-terminal',
          name: 'Pattaya Bus Terminal',
          type: t('area.labels.bus'),
          distance: t('units.distance.kilometers', { distance: 13 }),
        },
        {
          id: 'main-station',
          name: 'Pattaya Train Station',
          type: t('area.labels.train'),
          distance: t('units.distance.kilometers', { distance: 14 }),
        },
      ],
    },
    {
      id: 'airports',
      title: t('area.categories.airports'),
      icon: PlaneTakeoff,
      items: [
        {
          id: 'utapao',
          name: 'U-Tapao Rayong-Pattaya International Airport',
          distance: t('units.distance.kilometers', { distance: 33 }),
        },
        {
          id: 'suvarnabhumi',
          name: 'Suvarnabhumi Airport',
          distance: t('units.distance.kilometers', { distance: 81 }),
        },
        {
          id: 'hua-hin',
          name: 'Hua Hin Airport',
          distance: t('units.distance.kilometers', { distance: 95 }),
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="2xl" as="h2">
          {t('area.title')}
        </Heading>
        <ButtonLink $color="blue" $size="sm" href="#availability">
          {t('availability.actions.seeAvailability')}
        </ButtonLink>
      </TitleGroup>
      <Button
        $color="blue"
        $size="sm"
        $underline="hover"
        $variant="link"
        style={{ marginTop: '10px' }}
      >
        {t('area.location.excellentWithMap')}
      </Button>

      <NearbyAreaGroup>
        {nearbyAreaGroups.map(({ id, title, icon, items }) => (
          <AreaGroup key={id}>
            <Text
              $iconSize="lg"
              $weight="bold"
              startIcon={icon}
              style={{ marginBlockEnd: '14px' }}
            >
              {title}
            </Text>
            <AreaItemList>
              {items.map(({ name, distance, type }) => (
                <AreaItem key={`${name}-${distance}`}>
                  <Text $size="sm">
                    {type ? <AreaType>{type}</AreaType> : null}
                    {name}
                  </Text>
                  <Text $color="description" $size="sm">
                    {distance}
                  </Text>
                </AreaItem>
              ))}
            </AreaItemList>
          </AreaGroup>
        ))}
      </NearbyAreaGroup>

      <Text $color="description" $size="xs">
        {t('area.disclaimer.distance')}
        <Text as="div">{t('area.disclaimer.noRoute')}</Text>
      </Text>
    </Wrapper>
  );
};
