// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Navigation } from 'swiper/modules';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Card, Heading, Link, Swiper, Text } from '@/shared/ui';

import {
  SwiperRoot,
  Title,
  Wrapper,
} from './get-inspiration-for-next-trip.styled';

import type { GetInspirationForNextTripProps } from './get-inspiration-for-next-trip.types';
import type { FC } from 'react';

export const GetInspirationForNextTrip: FC<GetInspirationForNextTripProps> = ({
  articles,
}) => {
  const { t } = useTranslation('home');

  return (
    <Wrapper $showOnly="desktop">
      <Title>
        <Heading $size="2xl" as="h2">
          {t('inspirationNextTrip.heading')}
        </Heading>
        <Link
          $color="blue"
          $underline="hover"
          aria-label="Travel articles"
          href="articles"
        >
          {t('actions.more')}
        </Link>
      </Title>
      <Swiper.Wrapper>
        <SwiperRoot
          navigation
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={13}
          breakpoints={{
            1580: {
              spaceBetween: 15,
            },
          }}
        >
          {articles.map((article) => (
            <Swiper.Slide key={article.id}>
              <Link href={article.link}>
                <Card.Root>
                  <Card.ImageContainer $radiusPosition="all">
                    <Card.Image
                      alt={`${article.title} card image`}
                      height="500"
                      src={article.image}
                      width="500"
                    />
                  </Card.ImageContainer>
                  <Card.Content style={{ paddingTop: '14px' }}>
                    <Text $weight="bold" as="span">
                      {article.title}
                    </Text>
                    <Text
                      $color="description"
                      $size="sm"
                      as="p"
                      style={{ marginTop: '6px' }}
                    >
                      {article.description}
                    </Text>
                  </Card.Content>
                </Card.Root>
              </Link>
            </Swiper.Slide>
          ))}
        </SwiperRoot>
      </Swiper.Wrapper>
    </Wrapper>
  );
};
