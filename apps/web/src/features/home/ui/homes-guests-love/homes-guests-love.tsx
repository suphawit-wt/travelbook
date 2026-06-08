// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';

import { PropertyCard } from '@/entities/property/ui/property-card';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Card, Heading, Skeleton, Swiper } from '@/shared/ui';

import { SwiperRoot, Title, Wrapper } from './homes-guests-love.styled';

import type { HomesGuestsLoveProps } from './homes-guests-love.types';
import type { FC } from 'react';

export const HomesGuestsLove: FC<HomesGuestsLoveProps> = ({ properties }) => {
  const { t } = useTranslation('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Wrapper $showOnly="desktop">
        <Title>
          <Heading $size="2xl" as="h2">
            {t('homeGuestLove.heading')}
          </Heading>
          <ButtonLink
            $color="blue"
            $size="sm"
            $variant="ghost"
            href="booking-home"
          >
            {t('discoverHomes.cta')}
          </ButtonLink>
        </Title>
        <div
          style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
            padding: '0 5px 10px 5px',
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <Card.Root
              key={i}
              $variant="classic"
              style={{
                overflow: 'hidden',
              }}
            >
              <Card.ImageContainer>
                <Skeleton height="500px" width="500px" />
              </Card.ImageContainer>
              <Card.Content
                $padding="md"
                style={{
                  height: '214px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div>
                    <Skeleton height="16px" width="180px" />
                  </div>
                  <div style={{ paddingTop: '10px' }}>
                    <Skeleton height="16px" width="100px" />
                  </div>
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                  <Skeleton height="16px" width="100px" />
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper $showOnly="desktop">
      <Title>
        <Heading $size="2xl" as="h2">
          {t('homeGuestLove.heading')}
        </Heading>
        <ButtonLink
          $color="blue"
          $size="sm"
          $variant="ghost"
          href="booking-home"
        >
          {t('discoverHomes.cta')}
        </ButtonLink>
      </Title>
      <Swiper.Wrapper>
        <SwiperRoot
          navigation
          modules={[Navigation]}
          slidesOffsetAfter={5}
          slidesOffsetBefore={5}
          slidesPerView="auto"
          spaceBetween={11}
          breakpoints={{
            1580: {
              spaceBetween: 15,
            },
          }}
        >
          {properties.map((property) => (
            <Swiper.Slide key={property.id}>
              <PropertyCard
                area={property.area}
                avgRating={property.avgRating}
                city={property.city}
                countryCode={property.countryCode}
                image={property.image}
                name={property.name}
                reviewCount={property.reviewCount}
                slug={property.slug}
                startingPrice={property.startingPrice}
                variants="portrait"
              />
            </Swiper.Slide>
          ))}
        </SwiperRoot>
      </Swiper.Wrapper>
    </Wrapper>
  );
};
