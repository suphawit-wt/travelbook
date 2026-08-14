// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Heart, Share2 } from 'lucide-react';
import { Navigation, Pagination } from 'swiper/modules';

import { ReviewInfo } from '@/entities/reviews/ui/review-info';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Heading,
  Image,
  Link,
  Skeleton,
  StarRating,
  Swiper,
  Text,
} from '@/shared/ui';

import {
  ActionGroup,
  AddressGroup,
  DetailGroup,
  Header,
  HotelPageTop,
  ImageWrapper,
  SwiperRoot,
  SwiperWrapper,
  Wrapper,
} from './mobile-property-overview.styled';

import type { MobilePropertyOverviewProps } from './mobile-property-overview.types';
import type { FC } from 'react';

export const MobilePropertyOverview: FC<MobilePropertyOverviewProps> = ({
  propertyDetails,
}) => {
  const { t } = useTranslation('country');

  return (
    <Wrapper>
      <Header>
        <HotelPageTop>
          <DetailGroup>
            <StarRating count={3} />
          </DetailGroup>

          <ActionGroup>
            <Button $variant="ghost" startIcon={Heart} tooltip="Save" />
            <Button
              $variant="ghost"
              startIcon={Share2}
              tooltip="Share this property"
            />
          </ActionGroup>
        </HotelPageTop>
        <Heading $size="3xl">
          {propertyDetails?.name ? (
            propertyDetails.name
          ) : (
            <Skeleton height="24px" width="230px" />
          )}
        </Heading>
        <AddressGroup>
          <Text $color="description" $size="sm">
            {propertyDetails?.zipCode &&
            propertyDetails.area &&
            propertyDetails.countryCode &&
            propertyDetails.city ? (
              <>
                {propertyDetails.zipCode}&nbsp;{propertyDetails.area},&nbsp;
                {propertyDetails.city},&nbsp;
                {t(propertyDetails.countryCode, {
                  ns: 'country',
                })}
              </>
            ) : (
              <Skeleton height="16px" width="260px" />
            )}
          </Text>
          &nbsp;&ndash;&nbsp;
          <Text $color="green" $size="sm" $weight="bold">
            Great location
          </Text>
          <Link $color="blue" $size="sm" $underline="hover" href="/">
            &nbsp;&ndash;&nbsp;show on map
          </Link>
        </AddressGroup>
        <ReviewInfo
          rating={propertyDetails?.avgRating ?? 0}
          reviews={propertyDetails?.reviewCount ?? 0}
          style={{
            marginTop: '10px',
          }}
        />
      </Header>
      <SwiperWrapper>
        <SwiperRoot
          loop
          navigation
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          pagination={{
            type: 'fraction',
          }}
        >
          {propertyDetails?.images.map((image, index) => (
            <Swiper.Slide key={image.id}>
              <ImageWrapper>
                <Image
                  alt={`${propertyDetails.name} ${index + 1}`}
                  height={500}
                  src={image.url}
                  width={500}
                />
              </ImageWrapper>
            </Swiper.Slide>
          ))}
        </SwiperRoot>
      </SwiperWrapper>
    </Wrapper>
  );
};
