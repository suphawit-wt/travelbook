// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Navigation } from 'swiper/modules';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Image, Swiper, Text } from '@/shared/ui';

import { ReviewInfo } from '../review-info/review-info';

import {
  Content,
  CountryDisplay,
  Footer,
  Header,
  ProfileDisplay,
  Rating2,
  ReviewItem,
  ReviewerInfo,
  SwiperRoot,
  Wrapper,
} from './review-sidebar.styled';

import type { ReviewSidebarProps } from './review-sidebar.types';
import type { FC } from 'react';

export const ReviewSidebar: FC<ReviewSidebarProps> = ({
  reviews,
  avgRating,
  reviewCount,
}) => {
  const { t } = useTranslation(['reviews', 'country']);

  return (
    <Wrapper>
      <Header>
        <ReviewInfo rating={avgRating} reviews={reviewCount} variants="stack" />
      </Header>
      <Content>
        <Text $size="xs" as="div" style={{ margin: '8px 12px' }}>
          {t('guestsWhoStayedHereLoved')}
        </Text>
        {reviews.length > 0 ? (
          <Swiper.Wrapper>
            <SwiperRoot
              navigation
              allowTouchMove={false}
              modules={[Navigation]}
              slidesPerView={1}
            >
              {reviews.map((review) => (
                <Swiper.Slide key={review.id}>
                  <ReviewItem>
                    <Text
                      as="p"
                      style={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        fontSize: '13px',
                        lineHeight: '15.6px',
                      }}
                    >
                      “{review.comment}”
                    </Text>
                    <ReviewerInfo>
                      <ProfileDisplay>
                        {review.displayName.at(0)}
                      </ProfileDisplay>
                      <Text $size="xs" style={{ marginInlineStart: '6px' }}>
                        {review.displayName}
                      </Text>
                      <CountryDisplay>
                        <Image
                          alt="country flag"
                          height={12}
                          src="/assets/images/flags/th.png"
                          width={12}
                        />
                        <Text $color="description" $size="xs">
                          {t(review.countryCode, { ns: 'country' })}
                        </Text>
                      </CountryDisplay>
                    </ReviewerInfo>
                  </ReviewItem>
                </Swiper.Slide>
              ))}
            </SwiperRoot>
          </Swiper.Wrapper>
        ) : null}
      </Content>
      <Footer>
        <span>{t('topRatedBeachNearby')}</span>
        <Rating2>8.5</Rating2>
      </Footer>
    </Wrapper>
  );
};
