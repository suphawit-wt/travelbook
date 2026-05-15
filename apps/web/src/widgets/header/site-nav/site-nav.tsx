// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  BedSingle,
  Car,
  CarTaxiFront,
  FerrisWheel,
  Globe2,
  Plane,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink } from '@/shared/ui';

import { Wrapper } from './site-nav.styled';

import type { SiteNavItemType } from './site-nav.types';

export const SiteNav = () => {
  const { t } = useTranslation('common');

  const pathname = usePathname();
  const path = pathname.split('/');

  const currentSlug = path[2];
  const validSlugs = [
    'flights',
    'flight-hotel',
    'car-rentals',
    'attractions',
    'airport-taxis',
  ];

  const isFallbackToStays =
    path[2] === undefined || (currentSlug && !validSlugs.includes(currentSlug));

  const siteNavItems: SiteNavItemType[] = [
    {
      id: 1,
      href: '/',
      label: t('header.nav.stays'),
      icon: BedSingle,
      isActive: Boolean(isFallbackToStays),
    },
    {
      id: 2,
      href: 'flights',
      label: t('header.nav.flights'),
      icon: Plane,
      isActive: currentSlug === 'flights',
    },
    {
      id: 3,
      href: 'flight-hotel',
      label: t('header.nav.flightHotel'),
      icon: Globe2,
      isActive: currentSlug === 'flight-hotel',
    },
    {
      id: 4,
      href: 'car-rentals',
      label: t('header.nav.carRentals'),
      icon: Car,
      isActive: currentSlug === 'car-rentals',
    },
    {
      id: 5,
      href: 'attractions',
      label: t('header.nav.attractions'),
      icon: FerrisWheel,
      isActive: currentSlug === 'attractions',
    },
    {
      id: 6,
      href: 'airport-taxis',
      label: t('header.nav.airportTaxis'),
      icon: CarTaxiFront,
      isActive: currentSlug === 'airport-taxis',
    },
  ];

  return (
    <Wrapper>
      <ul>
        {siteNavItems.map(({ id, href, isActive, icon, label }) => {
          return (
            <li key={id}>
              <ButtonLink
                $isActive={isActive}
                $radius="full"
                $size="sm"
                $variant="ghost"
                href={href}
                startIcon={icon}
              >
                {label}
              </ButtonLink>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};
