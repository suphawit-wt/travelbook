// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Card, Heading, Link, Skeleton, Swiper, Text } from '@/shared/ui';

import { Wrapper } from './property-type.styled';

import type { PropertyTypeProps } from './property-type.types';
import type { FC } from 'react';

export const PropertyType: FC<PropertyTypeProps> = ({ propertyTypes }) => {
  const { t } = useTranslation(['home', 'property']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- for client render
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Wrapper>
        <Heading $size="2xl" as="h2" style={{ marginBottom: '20px' }}>
          {t('propertyType.heading', { ns: 'home' })}
        </Heading>
        <div
          style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <Card.Root key={i}>
              <Card.ImageContainer $radiusPosition="all">
                <Skeleton height="260px" width="260px" />
              </Card.ImageContainer>
              <Card.Content style={{ paddingTop: '14px' }}>
                <Skeleton height="16px" width="100px" />
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading $size="2xl" as="h2" style={{ marginBottom: '20px' }}>
        {t('propertyType.heading', { ns: 'home' })}
      </Heading>
      <Swiper.Wrapper>
        <Swiper.Root
          navigation
          modules={[Navigation]}
          slidesPerView={1.5}
          spaceBetween={15}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
            },
            2060: {
              slidesPerView: 5,
            },
          }}
        >
          {propertyTypes.map((propertyType) => (
            <Swiper.Slide key={propertyType.id}>
              <Link href={propertyType.link}>
                <Card.Root>
                  <Card.ImageContainer $radiusPosition="all">
                    <Card.Image
                      alt={propertyType.title}
                      height="500"
                      src={propertyType.image}
                      width="500"
                    />
                  </Card.ImageContainer>
                  <Card.Content style={{ paddingTop: '14px' }}>
                    <Text $weight="bold" as="span">
                      {t(`type.${propertyType.title}`, { ns: 'property' })}
                    </Text>
                  </Card.Content>
                </Card.Root>
              </Link>
            </Swiper.Slide>
          ))}
        </Swiper.Root>
      </Swiper.Wrapper>
    </Wrapper>
  );
};
