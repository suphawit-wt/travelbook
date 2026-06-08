// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Text } from '@/shared/ui';

import { FeedbackBox, FeedbackLeft, Rating } from './review-info.styled';

import type { ReviewInfoProps } from './review-info.types';
import type { FC } from 'react';

export const ReviewInfo: FC<ReviewInfoProps> = ({
  rating,
  reviews,
  variants = 'landscape',
  $align = 'right',
  $size = 'md',
  $weight = 'normal',
  ...props
}) => {
  const { t } = useTranslation('reviews');

  let level = '';

  if (rating >= 9.5) {
    level = t('reviewInfo.exceptional');
  } else if (rating >= 9.0) {
    level = t('reviewInfo.wonderful');
  } else if (rating >= 8.5) {
    level = t('reviewInfo.excellent');
  } else if (rating >= 8.0) {
    level = t('reviewInfo.veryGood');
  } else if (rating >= 7.0) {
    level = t('reviewInfo.good');
  } else {
    level = t('reviewInfo.reviewScore');
  }

  if (variants === 'stack') {
    if ($align === 'right') {
      return (
        <FeedbackBox {...props}>
          <FeedbackLeft>
            <Text $align="right" $size={$size} $weight={$weight} as="span">
              {level}
            </Text>
            <Text $align="right" $color="description" $size="xs" as="span">
              {reviews.toLocaleString()} {t('reviews')}
            </Text>
          </FeedbackLeft>
          <Rating $size={$size}>{rating.toFixed(1)}</Rating>
        </FeedbackBox>
      );
    }

    return (
      <FeedbackBox {...props}>
        <Rating $size={$size}>{rating.toFixed(1)}</Rating>
        <FeedbackLeft>
          <Text $size={$size} $weight={$weight} as="span">
            {level}
          </Text>
          <Text $align="left" $color="description" $size="xs" as="span">
            {reviews.toLocaleString()} {t('reviews')}
          </Text>
        </FeedbackLeft>
      </FeedbackBox>
    );
  }

  return (
    <FeedbackBox {...props} style={{ alignItems: 'center' }}>
      <Rating $size={$size}>{rating.toFixed(1)}</Rating>
      <Text $size={$size} $weight={$weight} as="span">
        {level}
      </Text>
      <Text $color="description" $size={$size} as="span">
        {reviews.toLocaleString()} {t('reviews')}
      </Text>
    </FeedbackBox>
  );
};
