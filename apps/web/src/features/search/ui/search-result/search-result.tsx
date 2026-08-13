// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { ArrowDownUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { type FC, useState } from 'react';

import { PropertyCard } from '@/entities/property/ui/property-card';
import type { PropertyItemWithRoom } from '@/features/property/lib/property.service.types';
import { PropertyService } from '@/features/property/lib/property.service';
import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import type { ApiResponseWithDataPagination } from '@/shared/types/api';
import {
  Button,
  Card,
  DropdownMenu,
  Heading,
  RadioButton,
  Separator,
  Skeleton,
  Text,
} from '@/shared/ui';
import { calculateNights } from '@/shared/utils/date';

import { MobileFilterList } from './mobile/mobile-filter-list/mobile-filter-list';
import { MobilePropertyList } from './mobile/mobile-property-list/mobile-property-list';
import { SearchFilterBar } from './mobile/search-filter-bar/search-filter-bar';
import {
  LoadMoreResultsWrapper,
  PropertyGroup,
  Title,
  Wrapper,
} from './search-result.styled';

import type { SearchResultProps, ViewDisplay } from './search-result.types';

export const SearchResult: FC<SearchResultProps> = ({ searchQuery }) => {
  const propertyService = new PropertyService(axiosClient);
  const { t } = useTranslation('search');
  const [view, setView] = useState<ViewDisplay>('list');
  const currency = useAppSelector(selectCurrency);
  const perPage = 10;
  const nights = calculateNights(searchQuery.checkIn, searchQuery.checkOut);

  const queryParams = new URLSearchParams({
    dest: searchQuery.destination,
    checkin: searchQuery.checkIn,
    checkout: searchQuery.checkOut,
    adult: searchQuery.adult.toString(),
    children: searchQuery.children.toString(),
    room: searchQuery.room.toString(),
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ApiResponseWithDataPagination<PropertyItemWithRoom[]>,
    Error,
    InfiniteData<ApiResponseWithDataPagination<PropertyItemWithRoom[]>>,
    QueryKey,
    number
  >({
    queryKey: [
      'properties',
      searchQuery.destination,
      searchQuery.checkIn,
      searchQuery.checkOut,
      searchQuery.adult,
      searchQuery.children,
      searchQuery.room,
      perPage,
      currency,
    ],

    queryFn: ({ pageParam = 1 }) =>
      propertyService.searchProperties(
        searchQuery.destination,
        searchQuery.checkIn,
        searchQuery.checkOut,
        searchQuery.adult,
        searchQuery.children,
        searchQuery.room,
        pageParam,
        perPage,
        currency,
      ),

    initialPageParam: 1,
    retry: 2,

    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });

  const totalCount = data?.pages[0]?.pagination.totalCount ?? 0;

  const properties: PropertyItemWithRoom[] =
    data?.pages.flatMap((page) => page.data) ?? ([] as PropertyItemWithRoom[]);

  return (
    <Wrapper>
      <SearchFilterBar />
      <Separator $showOnly="mobile" />
      <MobileFilterList />
      <MobilePropertyList
        nights={nights}
        properties={properties}
        queryString={queryParams.toString()}
      />

      <Title>
        <Heading
          $size="xl"
          $weight="bold"
          as="h1"
          style={{ marginBottom: '10px' }}
        >
          {t('results.summary', {
            destination: searchQuery.destination,
            count: totalCount,
            ns: 'search',
          })}
        </Heading>
        <RadioButton.Root
          value={view}
          onValueChange={(val) => setView(val as ViewDisplay)}
        >
          <RadioButton.Item disabled={view === 'list'} value="list">
            <Text>{t('layout.list')}</Text>
          </RadioButton.Item>
          <RadioButton.Item disabled={view === 'grid'} value="grid">
            <Text>{t('layout.grid')}</Text>
          </RadioButton.Item>
        </RadioButton.Root>
      </Title>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            $radius="full"
            $size="sm"
            $variant="outline"
            endIcon={ChevronsUpDown}
            startIcon={ArrowDownUp}
            style={{ marginBottom: '20px' }}
          >
            {t('sort.current', {
              label: t('sort.options.topPicks', { ns: 'search' }),
              ns: 'search',
            })}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={5}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.topPicks')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.homesFirst')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.priceLow')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.priceHigh')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.bestValue')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.ratingHigh')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.ratingLow')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.ratingAndPrice')}
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                $radius="none"
                $size="sm"
                $variant="ghost"
                style={{ justifyContent: 'normal' }}
              >
                {t('sort.options.topReviewed')}
              </Button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          {Array.from({ length: 2 }, (_, i) => (
            <Card.Root
              key={i}
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
                <Skeleton height="240px" width="240px" />
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
                    <Skeleton height="20px" width="220px" />
                  </div>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <div>
                    <Skeleton height="16px" width="120px" />
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      ) : null}

      {error ? <Text as="div">{t('errors.unknown')}</Text> : null}

      {properties.length === 0 && !error && !isLoading ? (
        <Text as="div">{t('results.notFound')}</Text>
      ) : (
        <>
          <PropertyGroup $view={view}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                adults={searchQuery.adult}
                area={property.area}
                avgRating={property.avgRating}
                childrens={searchQuery.children}
                city={property.city}
                countryCode={property.countryCode}
                image={property.image}
                name={property.name}
                nights={nights}
                queryString={queryParams.toString()}
                reviewCount={property.reviewCount}
                room={property.room}
                slug={property.slug}
                startingPrice={property.startingPrice}
                variants={view === 'list' ? 'landscape' : 'search-portrait'}
              />
            ))}
          </PropertyGroup>

          {hasNextPage ? (
            <LoadMoreResultsWrapper>
              <Button
                $color="blue"
                $variant="outline"
                disabled={isFetchingNextPage}
                endIcon={ChevronDown}
                onClick={() => fetchNextPage()}
              >
                {t('results.loadMore')}
              </Button>
            </LoadMoreResultsWrapper>
          ) : null}
        </>
      )}
    </Wrapper>
  );
};
