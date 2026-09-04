// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Breadcrumbs } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';

import { Wrapper } from './mobile-breadcrumbs.styled';

import type { FC } from 'react';

interface MobileBreadcrumbsProps {
  propertyName?: string;
}

export const MobileBreadcrumbs: FC<MobileBreadcrumbsProps> = ({
  propertyName,
}) => {
  const { t } = useTranslation(['property', 'country', 'common']);

  return (
    <Wrapper>
      <Breadcrumbs.Root $size="sm">
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="/">
              {t('breadcrumbs.home')}
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="hotels">{t('type.hotel')}</Breadcrumbs.Link>
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
            <Breadcrumbs.Page>{propertyName}</Breadcrumbs.Page>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </Wrapper>
  );
};
