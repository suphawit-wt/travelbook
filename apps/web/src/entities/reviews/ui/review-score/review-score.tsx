// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Progress, Text } from '@/shared/ui';

import {
  MobileReviewsGroup,
  ReviewItem,
  ReviewItemTitle,
  ReviewsGroup,
} from './review-score.styled';

import type { ReviewScoreProps } from './review-score.types';
import type { FC } from 'react';

export const ReviewScore: FC<ReviewScoreProps> = ({
  location,
  cleanliness,
  valueOfMoney,
  facilities,
  comfort,
  staff,
  wifi,
  $variants = 'landscape',
  ...props
}) => {
  const { t } = useTranslation('reviews');
  const [isShowMore, setIsShowMore] = useState(false);

  if ($variants === 'landscape') {
    return (
      <ReviewsGroup {...props}>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.staff')}
            </Text>
            <Text $size="sm" $weight="medium">
              {staff}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={staff * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.facilities')}
            </Text>
            <Text $size="sm" $weight="medium">
              {facilities}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={facilities * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.cleanliness')}
            </Text>
            <Text $size="sm" $weight="medium">
              {cleanliness}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={cleanliness * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.comfort')}
            </Text>
            <Text $size="sm" $weight="medium">
              {comfort}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={comfort * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text $size="sm" $weight="medium">
              {t('categories.valueForMoney')}
            </Text>
            <Text $size="sm" $weight="medium">
              {valueOfMoney}
            </Text>
          </ReviewItemTitle>
          <Progress value={valueOfMoney * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.location')}
            </Text>
            <Text $size="sm" $weight="medium">
              {location}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={location * 10} />
        </ReviewItem>
        <ReviewItem style={{ gridColumn: '1/2' }}>
          <ReviewItemTitle>
            <Text $size="sm" $weight="medium">
              {t('categories.freeWiFi')}
            </Text>
            <Text $size="sm" $weight="medium">
              {wifi}
            </Text>
          </ReviewItemTitle>
          <Progress value={wifi * 10} />
        </ReviewItem>
        <ReviewItem style={{ gridColumn: '2/4', justifySelf: 'end' }}>
          <Text $iconColor="green" $size="xs" startIcon={ArrowUp}>
            {t('highScoreFor', { destination: 'Bangkok' })}
          </Text>
        </ReviewItem>
      </ReviewsGroup>
    );
  } else if ($variants === 'portrait') {
    return (
      <MobileReviewsGroup {...props}>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.staff')}
            </Text>
            <Text $size="sm" $weight="medium">
              {staff}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={staff * 10} />
        </ReviewItem>

        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.facilities')}
            </Text>
            <Text $size="sm" $weight="medium">
              {facilities}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={facilities * 10} />
        </ReviewItem>

        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.cleanliness')}
            </Text>
            <Text $size="sm" $weight="medium">
              {cleanliness}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={cleanliness * 10} />
        </ReviewItem>

        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.comfort')}
            </Text>
            <Text $size="sm" $weight="medium">
              {comfort}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={comfort * 10} />
        </ReviewItem>

        <ReviewItem>
          <ReviewItemTitle>
            <Text $size="sm" $weight="medium">
              {t('categories.valueForMoney')}
            </Text>
            <Text $size="sm" $weight="medium">
              {valueOfMoney}
            </Text>
          </ReviewItemTitle>
          <Progress value={valueOfMoney * 10} />
        </ReviewItem>

        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.location')}
            </Text>
            <Text $size="sm" $weight="medium">
              {location}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={location * 10} />
        </ReviewItem>

        <ReviewItem style={{ gridColumn: '1/2' }}>
          <ReviewItemTitle>
            <Text $size="sm" $weight="medium">
              {t('categories.freeWiFi')}
            </Text>
            <Text $size="sm" $weight="medium">
              {wifi}
            </Text>
          </ReviewItemTitle>
          <Progress value={wifi * 10} />
        </ReviewItem>

        <ReviewItem style={{ alignSelf: 'end' }}>
          <Text $iconColor="green" $size="xs" startIcon={ArrowUp}>
            {t('highScoreFor', { destination: 'Bangkok' })}
          </Text>
        </ReviewItem>
      </MobileReviewsGroup>
    );
  }

  return (
    <Collapsible.Root open={isShowMore} onOpenChange={setIsShowMore}>
      <MobileReviewsGroup {...props}>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.staff')}
            </Text>
            <Text $size="sm" $weight="medium">
              {staff}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={staff * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.facilities')}
            </Text>
            <Text $size="sm" $weight="medium">
              {facilities}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={facilities * 10} />
        </ReviewItem>
        <ReviewItem>
          <ReviewItemTitle>
            <Text
              $iconColor="green"
              $size="sm"
              $weight="medium"
              endIcon={ArrowUp}
            >
              {t('categories.cleanliness')}
            </Text>
            <Text $size="sm" $weight="medium">
              {cleanliness}
            </Text>
          </ReviewItemTitle>
          <Progress color="green" value={cleanliness * 10} />
        </ReviewItem>
        <Collapsible.Content>
          <ReviewItem>
            <ReviewItemTitle>
              <Text
                $iconColor="green"
                $size="sm"
                $weight="medium"
                endIcon={ArrowUp}
              >
                {t('categories.comfort')}
              </Text>
              <Text $size="sm" $weight="medium">
                {comfort}
              </Text>
            </ReviewItemTitle>
            <Progress color="green" value={comfort * 10} />
          </ReviewItem>
          <ReviewItem>
            <ReviewItemTitle>
              <Text $size="sm" $weight="medium">
                {t('categories.valueForMoney')}
              </Text>
              <Text $size="sm" $weight="medium">
                {valueOfMoney}
              </Text>
            </ReviewItemTitle>
            <Progress value={valueOfMoney * 10} />
          </ReviewItem>
          <ReviewItem>
            <ReviewItemTitle>
              <Text
                $iconColor="green"
                $size="sm"
                $weight="medium"
                endIcon={ArrowUp}
              >
                {t('categories.location')}
              </Text>
              <Text $size="sm" $weight="medium">
                {location}
              </Text>
            </ReviewItemTitle>
            <Progress color="green" value={location * 10} />
          </ReviewItem>
          <ReviewItem style={{ gridColumn: '1/2' }}>
            <ReviewItemTitle>
              <Text $size="sm" $weight="medium">
                {t('categories.freeWiFi')}
              </Text>
              <Text $size="sm" $weight="medium">
                {wifi}
              </Text>
            </ReviewItemTitle>
            <Progress value={wifi * 10} />
          </ReviewItem>
        </Collapsible.Content>

        <ReviewItem style={{ alignSelf: 'end' }}>
          <Text $iconColor="green" $size="xs" startIcon={ArrowUp}>
            {t('highScoreFor', { destination: 'Bangkok' })}
          </Text>
        </ReviewItem>

        <Collapsible.Content>
          <Button $color="blue" $variant="outline" style={{ width: '100%' }}>
            {t('readAllReviews')}
          </Button>
        </Collapsible.Content>
      </MobileReviewsGroup>

      <Collapsible.Trigger asChild>
        {isShowMore ? (
          <Button
            $color="blue"
            $pressEffect="scale"
            $size="sm"
            $variant="ghost"
            endIcon={ChevronsUpDown}
          >
            {t('actions.showLess')}
          </Button>
        ) : (
          <Button
            $color="blue"
            $pressEffect="scale"
            $size="sm"
            $variant="ghost"
            endIcon={ChevronsUpDown}
          >
            {t('actions.showMore')}
          </Button>
        )}
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
};
