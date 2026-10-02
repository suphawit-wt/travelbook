// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ChevronRight, Heart } from 'lucide-react';

import { ReviewInfo } from '@/entities/reviews/ui/review-info';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  ButtonLink,
  Card,
  IconButton,
  Link,
  Separator,
  Text,
} from '@/shared/ui';

import {
  RecommendUnit,
  RecommendUnitPortrait,
  RoomDetailBox,
} from './property-card.styled';

import type { PropertyCardProps } from './property-card.types';

export const PropertyCard = ({
  variants,
  slug,
  name,
  image,
  area,
  countryCode,
  city,
  startingPrice,
  avgRating,
  reviewCount,
  room,
  nights,
  adults,
  childrens,
  queryString,
}: PropertyCardProps) => {
  const { t } = useTranslation(['property', 'country', 'common']);
  const currency = useAppSelector(selectCurrency);

  let link = 'hotels/' + slug;
  if (queryString) {
    link = link + '?' + queryString;
  }

  if (variants === 'landscape') {
    return (
      <Card.Root
        $variant="surface"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
        <Card.ImageContainer
          $radiusPosition="all"
          style={{
            marginRight: '16px',
            width: '240px',
            height: '240px',
            maxHeight: '240px',
          }}
        >
          <Link href={link}>
            <Card.Image
              alt={`${name} card image`}
              height="500"
              src={image}
              width="500"
            />
          </Link>
          <IconButton
            $color="white"
            $radius="full"
            $shadow="sm"
            $size="sm"
            aria-label="Save"
            icon={Heart}
            tooltip={t('actions.save', { ns: 'common' })}
          />
        </Card.ImageContainer>
        <Card.Content>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <Link
                $enableHoverColor
                $color="blue"
                $size="xl"
                $weight="bold"
                href={link}
              >
                {name}
              </Link>
              <div style={{ marginTop: '6px' }}>
                <Link
                  $color="blue"
                  $size="xs"
                  $underline="always"
                  $weight="bold"
                  href="region/th/koh-larn"
                >
                  {area},&nbsp;
                  {city},&nbsp;
                  {t(countryCode, { ns: 'country' })}
                </Link>
                <Link
                  $color="blue"
                  $size="xs"
                  $underline="always"
                  $weight="bold"
                  href="region/th/koh-larn/map"
                  style={{ marginLeft: '10px' }}
                >
                  {t('card.actions.showOnMap', { ns: 'property' })}
                </Link>
              </div>
            </div>
            <ReviewInfo
              $weight="medium"
              rating={avgRating}
              reviews={reviewCount}
              variants="stack"
            />
          </div>
          <div style={{ marginTop: '6px' }}>
            <RecommendUnit>
              <Text $size="xs" $weight="bold">
                {room.name}
              </Text>
              <Text $size="xs">
                {room.beds
                  .map((bed) =>
                    t(`beds.${bed.type}`, {
                      count: bed.quantity,
                      ns: 'property',
                    }),
                  )
                  .join(', ')}
              </Text>
              {room.breakfastIncluded ? (
                <Text $color="green" $size="xs" $weight="bold">
                  {t('card.pricing.breakfastIncluded', { ns: 'property' })}
                </Text>
              ) : null}
            </RecommendUnit>

            <RoomDetailBox>
              <Text $color="description" $size="xs">
                {t('card.occupancy.nights', {
                  count: nights,
                  ns: 'property',
                })}
                {t('card.occupancy.adults', {
                  count: adults,
                  ns: 'property',
                })}
                {childrens > 0 &&
                  t('card.occupancy.children', {
                    count: childrens,
                    ns: 'property',
                  })}
              </Text>
              <Text $size="xl">
                {t(`price.${currency}`, {
                  amount: startingPrice,
                  ns: 'common',
                })}
              </Text>
              <Text $color="description" $size="xs">
                {t('card.pricing.includesTaxes', { ns: 'property' })}
              </Text>
              <ButtonLink
                $color="blue"
                $size="sm"
                endIcon={ChevronRight}
                href={link}
                style={{ marginTop: '5px' }}
              >
                {t('card.actions.seeAvailability', { ns: 'property' })}
              </ButtonLink>
            </RoomDetailBox>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  if (variants === 'search-portrait') {
    return (
      <Card.Root
        $variant="surface"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Link href={link}>
          <Card.ImageContainer style={{ maxHeight: '260px' }}>
            <Card.Image alt={name} height="500" src={image} width="500" />
          </Card.ImageContainer>
          <Card.Content
            $padding="md"
            style={{
              height: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Link $enableHoverColor $color="blue" $weight="bold" href={link}>
                {name}
              </Link>
              <ReviewInfo
                $size="xs"
                rating={avgRating}
                reviews={reviewCount}
                style={{ marginTop: '6px' }}
                variants="landscape"
              />
              <div style={{ marginTop: '6px' }}>
                <Link
                  $color="blue"
                  $size="xs"
                  $underline="always"
                  $weight="bold"
                  href="region/th/koh-larn"
                >
                  {area},&nbsp;
                  {city},&nbsp;
                  {t(countryCode, { ns: 'country' })}
                </Link>
                <Link
                  $color="blue"
                  $size="xs"
                  $underline="always"
                  $weight="bold"
                  href="region/th/koh-larn/map"
                  style={{ marginLeft: '10px' }}
                >
                  {t('card.actions.showOnMap', { ns: 'property' })}
                </Link>
              </div>
              <Separator style={{ margin: '8px 0' }} />
              <RecommendUnitPortrait>
                <Text $size="xs" $weight="bold">
                  {room.name}
                </Text>
                <Text $size="xs">
                  {room.beds
                    .map((bed) =>
                      t(`beds.${bed.type}`, {
                        count: bed.quantity,
                        ns: 'property',
                      }),
                    )
                    .join(', ')}
                </Text>
                {room.breakfastIncluded ? (
                  <Text $color="green" $size="xs" $weight="bold">
                    {t('card.pricing.breakfastIncluded', { ns: 'property' })}
                  </Text>
                ) : null}
              </RecommendUnitPortrait>
            </div>
            <div>
              <RoomDetailBox>
                <Text $color="description" $size="xs">
                  {t('card.occupancy.nights', {
                    count: nights,
                    ns: 'property',
                  })}
                  {t('card.occupancy.adults', {
                    count: adults,
                    ns: 'property',
                  })}
                  {childrens > 0 &&
                    t('card.occupancy.children', {
                      count: childrens,
                      ns: 'property',
                    })}
                </Text>
                <Text $size="xl">
                  {t(`price.${currency}`, {
                    amount: startingPrice,
                    ns: 'common',
                  })}
                </Text>
                <Text $color="description" $size="xs">
                  {t('card.pricing.includesTaxes', { ns: 'property' })}
                </Text>
              </RoomDetailBox>
            </div>
          </Card.Content>
        </Link>
        <IconButton
          $color="white"
          $radius="full"
          $shadow="sm"
          $size="sm"
          aria-label="Save"
          icon={Heart}
          tooltip={t('actions.save', { ns: 'common' })}
          style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        />
      </Card.Root>
    );
  }

  return (
    <Card.Root
      $variant="classic"
      style={{
        overflow: 'hidden',
      }}
    >
      <Link href={link}>
        <Card.ImageContainer>
          <Card.Image alt={name} height="500" src={image} width="500" />
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
            <Text $weight="bold" as="span">
              {name}
            </Text>
            <Text
              $color="description"
              $size="xs"
              as="p"
              style={{ marginTop: '6px' }}
            >
              {area},&nbsp;
              {city},&nbsp;
              {t(countryCode, { ns: 'country' })}
            </Text>
            <ReviewInfo
              $size="xs"
              rating={avgRating}
              reviews={reviewCount}
              style={{ marginTop: '10px' }}
              variants="landscape"
            />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <Text
              $color="description"
              $size="xs"
              as="span"
              style={{ marginRight: '6px' }}
            >
              {t('card.pricing.startFrom', { ns: 'property' })}
            </Text>
            <Text $weight="bold" as="span">
              {t(`price.${currency}`, {
                amount: startingPrice,
                ns: 'common',
              })}
            </Text>
          </div>
        </Card.Content>
      </Link>
      <IconButton
        $color="white"
        $radius="full"
        $shadow="sm"
        $size="sm"
        aria-label="Save"
        icon={Heart}
        tooltip={t('actions.save', { ns: 'common' })}
        style={{
          position: 'absolute',
          right: '8px',
          top: '8px',
        }}
      />
    </Card.Root>
  );
};
