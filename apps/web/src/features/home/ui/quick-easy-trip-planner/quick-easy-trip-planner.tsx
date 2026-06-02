// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Bike, Building2, Heart, Sailboat, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Card,
  Heading,
  Link,
  Skeleton,
  Swiper,
  Tabs,
  Text,
} from '@/shared/ui';

import { Wrapper } from './quick-easy-trip-planner.styled';

import type { QuickEasyTripPlannerProps } from './quick-easy-trip-planner.types';
import type { FC } from 'react';

export const QuickEasyTripPlanner: FC<QuickEasyTripPlannerProps> = ({
  plans,
}) => {
  const { t } = useTranslation(['home', 'common']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabItems = [
    {
      id: 'beach',
      icon: Sailboat,
      label: t('easyTripPlanner.tabs.beach', { ns: 'home' }),
    },
    {
      id: 'romance',
      icon: Heart,
      label: t('easyTripPlanner.tabs.romance', { ns: 'home' }),
    },
    {
      id: 'outdoors',
      icon: Bike,
      label: t('easyTripPlanner.tabs.outdoors', { ns: 'home' }),
    },
    {
      id: 'city',
      icon: Building2,
      label: t('easyTripPlanner.tabs.city', { ns: 'home' }),
    },
    {
      id: 'relax',
      icon: Sprout,
      label: t('easyTripPlanner.tabs.relax', { ns: 'home' }),
    },
  ];

  const tabContents = [
    { id: 'beach', list: plans.beachList },
    { id: 'romance', list: plans.romanceList },
    { id: 'outdoors', list: plans.outdoorsList },
    { id: 'city', list: plans.cityList },
    { id: 'relax', list: plans.relaxList },
  ];

  if (!mounted) {
    return (
      <Wrapper>
        <Heading $size="2xl" as="h2">
          {t('easyTripPlanner.heading')}
        </Heading>
        <Text
          $color="description"
          as="p"
          style={{ marginTop: '6px', marginBottom: '16px' }}
        >
          {t('easyTripPlanner.description')}
        </Text>
        <Tabs.Root $variant="button" defaultValue="beach">
          <Tabs.List>
            {tabItems.map((item) => (
              <Tabs.Trigger key={item.id} asChild value={item.id}>
                <Button
                  $radius="full"
                  $size="sm"
                  $variant="ghost"
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabContents.map((tab) => (
            <Tabs.Content key={tab.id} value={tab.id}>
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  overflowX: 'auto',
                }}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <Card.Root key={i}>
                    <Card.ImageContainer
                      $radiusPosition="all"
                      style={{ maxHeight: '140px' }}
                    >
                      <Skeleton height="170px" width="170px" />
                    </Card.ImageContainer>
                    <Card.Content style={{ paddingTop: '14px' }}>
                      <Skeleton height="16px" width="100px" />
                      <Skeleton
                        height="14px"
                        style={{ marginTop: '6px' }}
                        width="80px"
                      />
                    </Card.Content>
                  </Card.Root>
                ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading $size="2xl" as="h2">
        {t('easyTripPlanner.heading')}
      </Heading>
      <Text
        $color="description"
        as="p"
        style={{ marginTop: '6px', marginBottom: '16px' }}
      >
        {t('easyTripPlanner.description')}
      </Text>
      <Tabs.Root $variant="button" defaultValue="beach">
        <Tabs.List>
          {tabItems.map((item) => (
            <Tabs.Trigger key={item.id} asChild value={item.id}>
              <Button
                $radius="full"
                $size="sm"
                $variant="ghost"
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabContents.map((tab) => (
          <Tabs.Content key={tab.id} value={tab.id}>
            <Swiper.Wrapper>
              <Swiper.Root
                navigation
                modules={[Navigation]}
                slidesPerView={1.5}
                spaceBetween={15}
                breakpoints={{
                  360: { slidesPerView: 2.5 },
                  480: { slidesPerView: 3.5 },
                  768: { slidesPerView: 4.5, spaceBetween: 20 },
                  1024: { slidesPerView: 6 },
                  2240: { slidesPerView: 7 },
                  2540: { slidesPerView: 8 },
                }}
              >
                {tab.list.map((destination) => (
                  <Swiper.Slide key={destination.id}>
                    <Link href={destination.link}>
                      <Card.Root>
                        <Card.ImageContainer
                          $radiusPosition="all"
                          style={{ maxHeight: '140px' }}
                        >
                          <Card.Image
                            alt={destination.name}
                            height="500"
                            src={destination.image}
                            width="500"
                          />
                        </Card.ImageContainer>
                        <Card.Content style={{ paddingTop: '14px' }}>
                          <Text $weight="bold" as="span">
                            {destination.name}
                          </Text>
                          <Text
                            $color="description"
                            $size="sm"
                            as="p"
                            style={{ marginTop: '6px' }}
                          >
                            {t('units.distance.kilometersAway', {
                              distance: destination.distance,
                              ns: 'common',
                            })}
                          </Text>
                        </Card.Content>
                      </Card.Root>
                    </Link>
                  </Swiper.Slide>
                ))}
              </Swiper.Root>
            </Swiper.Wrapper>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Wrapper>
  );
};
