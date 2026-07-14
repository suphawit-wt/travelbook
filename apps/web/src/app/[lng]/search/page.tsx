// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { HeaderSearch } from '@/features/search/ui/header-search';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Breadcrumbs, Container } from '@/shared/ui';

import type { FC } from 'react';

interface SearchProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Search: FC<SearchProps> = async ({ searchParams }) => {
  const { t } = await getTranslation(['country', 'common']);

  const destination = (await searchParams)['dest'] as string;
  const checkIn = (await searchParams)['checkin'] as string;
  const checkOut = (await searchParams)['checkout'] as string;
  const adult = Number((await searchParams)['adult']);
  const children = Number((await searchParams)['children']);
  const room = Number((await searchParams)['room']);

  const searchQuery = {
    destination,
    checkIn,
    checkOut,
    adult,
    children,
    room,
  };

  return (
    <>
      <HeaderSearch searchQuery={searchQuery} />
      <Container $fluidMobile>
        <Breadcrumbs.Root
          $showOnly="desktop"
          $size="sm"
          style={{ marginBottom: '20px' }}
        >
          <Breadcrumbs.List>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="/">
                {t('breadcrumbs.home')}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="country/th">
                {t('TH', { ns: 'country' })}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="region/th/bangkok">
                Bangkok
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Page>{t('breadcrumbs.results')}</Breadcrumbs.Page>
            </Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>
      </Container>
    </>
  );
};

export default Search;
