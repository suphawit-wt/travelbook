// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Accessibility,
  Bath,
  BedDouble,
  BedSingle,
  Check,
  Coffee,
  CookingPot,
  Flower2,
  Info,
  LandPlot,
  MessagesSquare,
  ParkingCircle,
  Sofa,
  Sprout,
  TentTree,
  Tv2,
  UserRound,
  Utensils,
  Waves,
  Wifi,
} from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Heading, Icon, Text } from '@/shared/ui';

import { TitleGroup } from '../hotel-area/hotel-area.styled';
import {
  FacilityGroup,
  FacilityItem,
} from '../property-overview/property-overview.styled';

import {
  FacilitiesAreaGroup,
  FacilitiesItem,
  FacilitiesItemList,
  FacilitiesTopicGroup,
  Wrapper,
} from './facilities.styled';

import type { FacilitiesGroup, FacilitiesProps } from './facilities.types';
import type { FC } from 'react';

export const Facilities: FC<FacilitiesProps> = ({ propertyName }) => {
  const { t } = useTranslation('facilities');

  const facilitiesGroups: FacilitiesGroup[] = [
    {
      icon: UserRound,
      title: 'sections.greatForStay',
      items: [
        'bathroom.private',
        'general.airConditioning',
        'parking.free',
        'outdoors.balcony',
        'internet.free',
        'sections.view',
        'outdoors.terrace',
        'bathroom.bathtub',
        'media.flatTV',
      ],
    },
    {
      icon: Bath,
      title: 'sections.bathroom',
      items: [
        'bathroom.toiletPaper',
        'bathroom.towels',
        'bathroom.bathtubOrShower',
        'bathroom.slippers',
        'bathroom.private',
        'bathroom.toilet',
        'bathroom.toiletries',
        'bathroom.bathrobe',
        'bathroom.hairdryer',
        'bathroom.bathtub',
        'bathroom.shower',
      ],
    },
    {
      icon: BedSingle,
      title: 'sections.bedroom',
      items: ['bedroom.linens', 'bedroom.walkInCloset'],
    },
    {
      icon: TentTree,
      title: 'sections.view',
      items: ['view.innerCourtyard', 'view.pool', 'view.garden'],
    },
    {
      icon: Flower2,
      title: 'sections.outdoors',
      items: [
        'outdoors.diningArea',
        'outdoors.privatePool',
        'outdoors.patio',
        'outdoors.balcony',
        'outdoors.terrace',
        'outdoors.garden',
      ],
    },
    {
      icon: CookingPot,
      title: 'sections.kitchen',
      items: ['kitchen.coffee', 'kitchen.kettle', 'kitchen.refrigerator'],
    },
    {
      icon: BedDouble,
      title: 'sections.roomAmenities',
      items: [
        'roomAmenities.socketNearBed',
        'roomAmenities.sofaBed',
        'roomAmenities.dryingRackForClothing',
        'roomAmenities.clothesRack',
      ],
    },
    {
      icon: LandPlot,
      title: 'sections.activities',
      items: ['activities.hotTub'],
    },
    {
      icon: Sofa,
      title: 'sections.livingArea',
      items: [
        'livingArea.dining',
        'livingArea.sofa',
        'livingArea.sitting',
        'livingArea.desk',
      ],
    },
    {
      icon: Tv2,
      title: 'sections.media',
      items: ['media.flatTV', 'media.tv'],
    },
    {
      icon: Utensils,
      title: 'sections.food',
      items: ['food.minibar', 'food.teaCoffeeMaker'],
    },
    {
      icon: Wifi,
      title: 'sections.internet',
      description: 'internet.description',
    },
    {
      icon: ParkingCircle,
      title: 'sections.parking',
      description: 'parking.description',
    },
    {
      icon: Info,
      title: 'sections.general',
      items: [
        'general.airConditioning',
        'general.smokeFree',
        'general.privateEntrance',
        'general.carpeted',
        'general.fan',
        'general.iron',
      ],
    },
    {
      icon: Accessibility,
      title: 'sections.accessibility',
      items: ['accessibility.groundFloor'],
    },
    {
      icon: Waves,
      title: 'sections.pool',
      items: [
        'pool.openAllYear',
        'pool.adultsOnly',
        'pool.saltwater',
        'pool.plunge',
        'pool.shallow',
        'pool.poolBeachTowels',
        'pool.beachChairsLoungers',
      ],
    },
    {
      icon: Sprout,
      title: 'sections.spa',
      items: ['spa.hotTub'],
    },
    {
      icon: MessagesSquare,
      title: 'sections.languages',
      items: ['languages.en', 'languages.th'],
    },
  ];

  return (
    <Wrapper>
      <TitleGroup id="facilities">
        <Heading $size="2xl" as="h2">
          {t('title', { hotelName: propertyName })}
        </Heading>
        <ButtonLink $color="blue" $size="sm" href="#availability">
          {t('availability.actions.seeAvailability', { ns: 'property' })}
        </ButtonLink>
      </TitleGroup>
      <Text $color="description" as="div" style={{ marginTop: '4px' }}>
        {t('reviewScore', { score: 9.6 })}
      </Text>
      <Text $weight="bold" as="div" style={{ marginTop: '26px' }}>
        {t('popular')}
      </Text>
      <FacilityGroup>
        <FacilityItem>
          <Icon $color="green" icon={Waves} />
          <Text $size="sm">{t('sections.pool')}</Text>
        </FacilityItem>
        <FacilityItem>
          <Icon $color="green" icon={ParkingCircle} />
          <Text $size="sm">{t('parking.free')}</Text>
        </FacilityItem>
        <FacilityItem>
          <Icon $color="green" icon={Wifi} />
          <Text $size="sm">{t('internet.free')}</Text>
        </FacilityItem>
        <FacilityItem>
          <Icon $color="green" icon={Coffee} />
          <Text $size="sm">{t('food.breakfast')}</Text>
        </FacilityItem>
      </FacilityGroup>

      <FacilitiesAreaGroup>
        {facilitiesGroups.map(({ icon, title, items, description }) => (
          <FacilitiesTopicGroup key={title}>
            <Text
              $iconSize="lg"
              $weight="bold"
              startIcon={icon}
              style={{ marginBlockEnd: '10px' }}
            >
              {t(title)}
            </Text>

            {description ? (
              <Text $color="description" $size="sm">
                {t(description)}
              </Text>
            ) : null}

            {items ? (
              <FacilitiesItemList>
                {items.map((item) => (
                  <FacilitiesItem key={item}>
                    <Text
                      $iconColor="green"
                      $iconSize="sm"
                      $size="sm"
                      startIcon={Check}
                    >
                      {t(item)}
                    </Text>
                  </FacilitiesItem>
                ))}
              </FacilitiesItemList>
            ) : null}
          </FacilitiesTopicGroup>
        ))}
      </FacilitiesAreaGroup>
    </Wrapper>
  );
};
