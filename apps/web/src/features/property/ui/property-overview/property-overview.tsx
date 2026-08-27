// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Coffee,
  Fence,
  Flower2,
  Heart,
  MapPin,
  ParkingCircle,
  Share2,
  TreePine,
  Waves,
  Wifi,
} from 'lucide-react';
import { Trans } from 'react-i18next/TransWithoutContext';

import { PhotoGallery } from '@/entities/property/ui/photo-gallery';
import { WePriceMatch } from '@/entities/property/ui/we-price-match/we-price-match';
import { ReviewSidebar } from '@/entities/reviews/ui/review-sidebar';
import { selectIsAuthenticated } from '@/features/auth/store/auth.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Heading,
  Icon,
  IconButton,
  Link,
  Skeleton,
  StarRating,
  Text,
} from '@/shared/ui';

import {
  AboutAndHilights,
  AboutGroup,
  ActionGroup,
  AddressGroup,
  DetailGroup,
  FacilityGroup,
  FacilityItem,
  GalleryReviewGroup,
  GallerySideBar,
  GeniusDiscountGroup,
  HilightsBox,
  HotelPageTop,
  MapBox,
  TopLocation,
} from './property-overview.styled';

import type { PropertyOverviewProps } from './property-overview.types';
import type { FC } from 'react';

export const PropertyOverview: FC<PropertyOverviewProps> = ({
  propertyDetails,
  nights,
}) => {
  const { t } = useTranslation(['property', 'country', 'facilities', 'common']);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <>
      <HotelPageTop>
        <DetailGroup>
          <StarRating count={3} />
          <Heading $size="2xl" $weight="bold" as="h2">
            {propertyDetails?.name ? (
              propertyDetails.name
            ) : (
              <Skeleton height="24px" width="230px" />
            )}
          </Heading>
          <AddressGroup>
            <Icon $color="blue" $size="lg" icon={MapPin} />
            <Text $size="sm">
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
            <Link
              $color="blue"
              $size="sm"
              $underline="hover"
              $weight="bold"
              href="/"
            >
              {t('overview.location.greatWithMap')}
            </Link>
          </AddressGroup>
        </DetailGroup>

        <ActionGroup>
          <div>
            <IconButton
              $color="blue"
              $variant="ghost"
              icon={Heart}
              tooltip={t('actions.save', { ns: 'common' })}
            />
            <IconButton
              $color="blue"
              $variant="ghost"
              icon={Share2}
              tooltip={t('overview.actions.share')}
            />
            <Button $color="blue" $size="sm">
              {t('overview.actions.reserve')}
            </Button>
          </div>

          <WePriceMatch />
        </ActionGroup>
      </HotelPageTop>

      <GalleryReviewGroup>
        <PhotoGallery
          avgRating={propertyDetails?.avgRating ?? 0}
          images={propertyDetails?.images ?? []}
          propertyName={propertyDetails?.name ?? ''}
          reviewCount={propertyDetails?.reviewCount ?? 0}
          reviews={propertyDetails?.reviews ?? []}
        />

        <GallerySideBar>
          <ReviewSidebar
            avgRating={propertyDetails?.avgRating ?? 0}
            reviewCount={propertyDetails?.reviewCount ?? 0}
            reviews={propertyDetails?.reviews ?? []}
          />
          <MapBox />
        </GallerySideBar>
      </GalleryReviewGroup>

      <AboutAndHilights>
        <AboutGroup>
          {!isAuthenticated ? (
            <GeniusDiscountGroup>
              <Text $size="sm">
                <Trans
                  i18nKey="genius.eligibility"
                  ns="common"
                  t={t}
                  values={{ hotelName: propertyDetails?.name }}
                  components={[
                    // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                    <Link
                      $color="blue"
                      $underline="always"
                      href="auth/sign-in"
                    />,
                  ]}
                />
              </Text>
              <Text $size="sm" style={{ marginTop: '10px' }}>
                {t('genius.note', { ns: 'common' })}
              </Text>
            </GeniusDiscountGroup>
          ) : null}
          <Text $size="lg" $weight="bold">
            {t('overview.about.title')}
          </Text>
          <Text $size="sm" style={{ marginTop: '12px' }}>
            {propertyDetails?.about ? (
              propertyDetails.about
            ) : (
              <Skeleton height="80px" />
            )}
          </Text>
          <Text $color="description" $size="xs" style={{ marginTop: '14px' }}>
            {t('overview.about.distanceDisclaimer')}
          </Text>
          <Text $weight="bold" style={{ marginTop: '20px' }}>
            {t('popular', { ns: 'facilities' })}
          </Text>
          <FacilityGroup>
            <FacilityItem>
              <Icon $color="green" icon={Waves} />
              <Text $size="sm">{t('sections.pool', { ns: 'facilities' })}</Text>
            </FacilityItem>
            <FacilityItem>
              <Icon $color="green" icon={ParkingCircle} />
              <Text $size="sm">{t('parking.free', { ns: 'facilities' })}</Text>
            </FacilityItem>
            <FacilityItem>
              <Icon $color="green" icon={Wifi} />
              <Text $size="sm">{t('internet.free', { ns: 'facilities' })}</Text>
            </FacilityItem>
            <FacilityItem>
              <Icon $color="green" icon={Coffee} />
              <Text $size="sm">
                {t('food.breakfast', { ns: 'facilities' })}
              </Text>
            </FacilityItem>
          </FacilityGroup>
        </AboutGroup>
        <HilightsBox>
          <Text $color="black" $weight="bold">
            {t('overview.highlights.title')}
          </Text>
          <Text
            $color="black"
            $size="sm"
            $weight="bold"
            style={{ marginTop: '14px' }}
          >
            {t('overview.highlights.perfectStay', { nights })}
          </Text>
          <TopLocation>
            <Icon color="black" icon={MapPin} />
            <Text $color="black" $size="sm">
              {t('overview.location.topRated', { score: 9.3 })}
            </Text>
          </TopLocation>
          <Text
            $color="black"
            $size="sm"
            $weight="bold"
            style={{ marginTop: '14px' }}
          >
            {t('overview.highlights.breakfast')}
          </Text>
          <Text $color="black" $size="xs" style={{ marginTop: '10px' }}>
            American
          </Text>
          <Text
            $color="black"
            $size="sm"
            $weight="bold"
            style={{ marginTop: '14px' }}
          >
            {t('overview.highlights.roomsWith')}:
          </Text>
          <TopLocation>
            <Icon $color="black" icon={TreePine} />
            <Text $color="black" $size="sm">
              {t('view.innerCourtyard', { ns: 'facilities' })}
            </Text>
          </TopLocation>
          <TopLocation>
            <Icon $color="black" icon={Waves} />
            <Text $color="black" $size="sm">
              {t('view.pool', { ns: 'facilities' })}
            </Text>
          </TopLocation>
          <TopLocation>
            <Icon $color="black" icon={Flower2} />
            <Text $color="black" $size="sm">
              {t('view.garden', { ns: 'facilities' })}
            </Text>
          </TopLocation>
          <TopLocation>
            <Icon $color="black" icon={Fence} />
            <Text $color="black" $size="sm">
              {t('outdoors.terrace', { ns: 'facilities' })}
            </Text>
          </TopLocation>
          <TopLocation>
            <Icon $color="black" icon={ParkingCircle} />
            <Text $color="black" $size="sm">
              {t('parking.free', { ns: 'facilities' })}
            </Text>
          </TopLocation>
          <Button $color="blue" style={{ marginTop: '20px' }}>
            {t('overview.actions.reserve')}
          </Button>
        </HilightsBox>
      </AboutAndHilights>
    </>
  );
};
