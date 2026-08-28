// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ReviewCard } from '@/entities/reviews/ui/review-card';
import { ReviewInfo } from '@/entities/reviews/ui/review-info/review-info';
import { ReviewScore } from '@/entities/reviews/ui/review-score/review-score';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Heading, Swiper } from '@/shared/ui';

import { SwiperRoot, Wrapper } from './mobile-reviews.styled';

import type { MobileReviewsProps } from './mobile-reviews.types';
import type { FC } from 'react';

export const MobileReviews: FC<MobileReviewsProps> = ({ reviews }) => {
  const { t } = useTranslation('reviews');

  return (
    <Wrapper>
      <Heading
        $size="xl"
        $weight="bold"
        as="h2"
        style={{ marginBottom: '16px' }}
      >
        {t('guestReviews')}
      </Heading>
      <ReviewInfo
        rating={9.5}
        reviews={83}
        variants="landscape"
        style={{
          marginBottom: '16px',
        }}
      />
      <ReviewScore
        $variants="portrait-compact"
        cleanliness={9.7}
        comfort={9.7}
        facilities={9.6}
        location={9.3}
        staff={9.6}
        valueOfMoney={8.8}
        wifi={7.5}
      />
      {reviews.length > 0 ? (
        <>
          <Heading
            $size="md"
            $weight="bold"
            as="h3"
            style={{ margin: '16px 0 14px' }}
          >
            {t('guestsWhoStayedHereLoved')}
          </Heading>

          <Swiper.Wrapper>
            <SwiperRoot
              slidesPerView={'auto'}
              spaceBetween={15}
              style={{ padding: '0 5px' }}
              breakpoints={{
                768: {
                  spaceBetween: 20,
                },
              }}
            >
              {reviews.map((review) => (
                <Swiper.Slide key={review.id}>
                  <ReviewCard
                    country={review.countryCode}
                    details={review.comment}
                    userName={review.displayName}
                  />
                </Swiper.Slide>
              ))}
            </SwiperRoot>
          </Swiper.Wrapper>
        </>
      ) : null}
    </Wrapper>
  );
};
