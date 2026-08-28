// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Plus } from 'lucide-react';
import { Navigation } from 'swiper/modules';

import { ReviewCard } from '@/entities/reviews/ui/review-card';
import { ReviewInfo } from '@/entities/reviews/ui/review-info/review-info';
import { ReviewScore } from '@/entities/reviews/ui/review-score/review-score';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Heading, Swiper, Text } from '@/shared/ui';

import { ReviewTopicsGroup, SwiperRoot, Wrapper } from './guest-review.styled';

import type { GuestReviewProps } from './guest-review.types';
import type { FC } from 'react';

export const GuestReview: FC<GuestReviewProps> = ({
  reviews,
  avgRating,
  reviewCount,
}) => {
  const { t } = useTranslation('reviews');

  return (
    <Wrapper>
      <Heading $size="2xl" as="h2">
        {t('guestReviews')}
      </Heading>
      <div
        style={{
          marginTop: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <ReviewInfo
          $weight="semibold"
          rating={avgRating}
          reviews={reviewCount}
          variants="landscape"
        />
        <Button $color="blue" $size="sm" $underline="hover" $variant="link">
          {t('readAllReviews')}
        </Button>
      </div>
      <Text $weight="bold">{t('categories.title')}:</Text>
      <ReviewScore
        cleanliness={9.7}
        comfort={9.7}
        facilities={9.6}
        location={9.3}
        staff={9.6}
        style={{ marginTop: '20px', marginBottom: '24px' }}
        valueOfMoney={8.8}
        wifi={7.5}
      />
      <Heading $size="md" $weight="bold" as="h3">
        {t('topics.title')}
      </Heading>
      <ReviewTopicsGroup>
        <Button $radius="full" $size="sm" $variant="outline" startIcon={Plus}>
          {t('topics.clean')}
        </Button>
        <Button $radius="full" $size="sm" $variant="outline" startIcon={Plus}>
          {t('topics.room')}
        </Button>
        <Button $radius="full" $size="sm" $variant="outline" startIcon={Plus}>
          {t('topics.breakfast')}
        </Button>
        <Button $radius="full" $size="sm" $variant="outline" startIcon={Plus}>
          {t('topics.location')}
        </Button>
        <Button $radius="full" $size="sm" $variant="outline" startIcon={Plus}>
          {t('topics.swimmingPool')}
        </Button>
      </ReviewTopicsGroup>
      {reviews.length > 0 ? (
        <>
          <Heading
            $size="md"
            $weight="bold"
            as="h3"
            style={{ marginBottom: '14px' }}
          >
            {t('guestsWhoStayedHereLoved')}
          </Heading>
          <Swiper.Wrapper>
            <SwiperRoot
              navigation
              modules={[Navigation]}
              slidesPerView={3}
              spaceBetween={15}
              style={{ padding: '0 5px' }}
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
          <Button
            $color="blue"
            $size="sm"
            $variant="outline"
            style={{ marginTop: '20px' }}
          >
            {t('readAllReviews')}
          </Button>
        </>
      ) : null}
    </Wrapper>
  );
};
