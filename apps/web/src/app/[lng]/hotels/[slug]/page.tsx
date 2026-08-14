// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { PropertyService } from '@/features/property/lib/property.service';
import type { PropertyWithDetail } from '@/features/property/lib/property.service.types';
import { HeaderSearch } from '@/features/search/ui/header-search';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import { Breadcrumbs, Container, Skeleton } from '@/shared/ui';

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

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <>
      <HeaderSearch searchQuery={searchQuery} />
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
      </Container>
    </>
  );
};

export default Hotels;
