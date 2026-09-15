// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { GeniusBanner } from '@/entities/banner/ui/genius-banner';
import { PropertyService } from '@/features/property/lib/property.service';
import type { PropertyWithDetail } from '@/features/property/lib/property.service.types';
import { AvailabilitySection } from '@/features/property/ui/availability-section';
import { BestOfPlaces } from '@/features/property/ui/best-of-places';
import { Facilities } from '@/features/property/ui/facilities';
import { FinePrint } from '@/features/property/ui/fine-print';
import { HotelArea } from '@/features/property/ui/hotel-area';
import { HotelFaq } from '@/features/property/ui/hotel-faq';
import { HouseRules } from '@/features/property/ui/house-rules';
import {
  MobilePropertyContent,
  MobilePropertyOverview,
} from '@/features/property/ui/mobile';
import { PropertyOverview } from '@/features/property/ui/property-overview';
import { TravelersAsking } from '@/features/property/ui/travelers-asking';
import { GuestReview } from '@/features/reviews/ui/guest-review';
import { HeaderSearch } from '@/features/search/ui/header-search';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import {
  Breadcrumbs,
  Button,
  ButtonLink,
  Container,
  Separator,
  Skeleton,
  Tabs,
} from '@/shared/ui';
import { calculateNights } from '@/shared/utils/date';

const Hotels = () => {
  const propertyService = new PropertyService(axiosClient);
  const { t } = useTranslation(['property', 'country', 'common']);
  const params = useParams();
  const searchParams = useSearchParams();
  const currency = useAppSelector(selectCurrency);

  const slug = params['slug'] as string;
  const destination = searchParams.get('dest') ?? '';
  const checkIn = searchParams.get('checkin') ?? '';
  const checkOut = searchParams.get('checkout') ?? '';
  const adult = Number(searchParams.get('adult') ?? 2);
  const children = Number(searchParams.get('children') ?? 0);
  const room = Number(searchParams.get('room') ?? 1);
  const nights = calculateNights(checkIn, checkOut);

  const searchQuery = {
    destination,
    checkIn,
    checkOut,
    adult,
    children,
    room,
  };

  const { data: propertyDetails, isError } = useQuery<
    PropertyWithDetail,
    Error,
    PropertyWithDetail
  >({
    queryKey: [
      'property-details',
      slug,
      checkIn,
      checkOut,
      adult,
      children,
      room,
      currency,
    ],
    queryFn: () =>
      propertyService.getPropertyBySlugWithAvailability(
        slug,
        checkIn,
        checkOut,
        adult,
        children,
        room,
        currency,
      ),
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const checkInOutRange = {
    checkInFrom: propertyDetails?.checkInFrom,
    checkInUntil: propertyDetails?.checkInUntil,
    checkOutFrom: propertyDetails?.checkOutFrom,
    checkOutUntil: propertyDetails?.checkOutUntil,
  };

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <>
      <HeaderSearch searchQuery={searchQuery} />
      <MobilePropertyOverview propertyDetails={propertyDetails} />
      <MobilePropertyContent
        nights={nights}
        propertyDetails={propertyDetails}
        searchQuery={searchQuery}
      />
      <Container $showOnly="desktop">
        <Breadcrumbs.Root $size="sm" style={{ marginBottom: '20px' }}>
          <Breadcrumbs.List>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="/">
                {t('breadcrumbs.home')}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="hotels">
                {t('type.hotel')}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="hotels/country/th">
                {t('TH', { ns: 'country' })}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="hotels/country/th/bangkok">
                Bangkok
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Page>
                {propertyDetails?.name ? (
                  propertyDetails.name
                ) : (
                  <Skeleton height="16px" width="100px" />
                )}
              </Breadcrumbs.Page>
            </Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>

        <Tabs.Root $variant="tabs" defaultValue="overview">
          <Tabs.List>
            <Tabs.Trigger asChild value="overview">
              <ButtonLink
                $variant="ghost"
                href="#overview"
                style={{ justifyContent: 'center' }}
              >
                {t('tabs.overview')}
              </ButtonLink>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="info_and_price">
              <ButtonLink
                $variant="ghost"
                href="#availability"
                style={{ justifyContent: 'center' }}
              >
                {t('tabs.infoAndPrices')}
              </ButtonLink>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="facilities">
              <ButtonLink
                $variant="ghost"
                href="#facilities"
                style={{ justifyContent: 'center' }}
              >
                {t('tabs.facilities')}
              </ButtonLink>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="house_rules">
              <ButtonLink
                $variant="ghost"
                href="#house_rules"
                style={{ justifyContent: 'center' }}
              >
                {t('tabs.houseRules')}
              </ButtonLink>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="fine_print">
              <ButtonLink
                $variant="ghost"
                href="#fine_print"
                style={{ justifyContent: 'center' }}
              >
                {t('tabs.finePrint')}
              </ButtonLink>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="guest_reviews">
              <Button $variant="ghost">
                {t('tabs.guestReviews', {
                  count: propertyDetails?.reviewCount ?? 0,
                })}
              </Button>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <PropertyOverview nights={nights} propertyDetails={propertyDetails} />
        <Separator style={{ marginTop: '20px', marginBottom: '20px' }} />
        <GeniusBanner />
        <AvailabilitySection
          nights={nights}
          propertyId={propertyDetails?.id}
          rooms={propertyDetails?.rooms ?? []}
          searchQuery={searchQuery}
        />
        <GuestReview
          avgRating={propertyDetails?.avgRating ?? 0}
          reviewCount={propertyDetails?.reviewCount ?? 0}
          reviews={propertyDetails?.reviews ?? []}
        />
        <TravelersAsking />
        <HotelArea />
        <Facilities propertyName={propertyDetails?.name} />
        <HouseRules
          checkInOutRange={checkInOutRange}
          propertyName={propertyDetails?.name}
          rules={propertyDetails?.rules}
        />
        <FinePrint />
        <HotelFaq propertyName={propertyDetails?.name} />
        <BestOfPlaces />
      </Container>
    </>
  );
};

export default Hotels;
