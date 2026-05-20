// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Container, Link } from '@/shared/ui';

import { Wrapper } from './footer-links.styled';

import type { LinkItemType } from './footer-links.types';

export const FooterLinks = async () => {
  const { t } = await getTranslation('common');

  const footerLinkItems: LinkItemType[] = [
    { id: 1, href: 'country', label: 'footer.links.locations.countries' },
    { id: 2, href: 'region', label: 'footer.links.locations.regions' },
    { id: 3, href: 'city', label: 'footer.links.locations.cities' },
    { id: 4, href: 'district', label: 'footer.links.locations.districts' },
    { id: 5, href: 'airport', label: 'footer.links.locations.airports' },
    { id: 6, href: 'hotel', label: 'footer.links.properties.hotels' },
    { id: 7, href: 'landmark', label: 'footer.links.properties.interest' },
    {
      id: 8,
      href: 'booking-home',
      label: 'footer.links.properties.vacationHomes',
    },
    { id: 9, href: 'apartments', label: 'footer.links.properties.apartments' },
    { id: 10, href: 'resorts', label: 'footer.links.properties.resorts' },
    { id: 11, href: 'villas', label: 'footer.links.properties.villas' },
    { id: 12, href: 'hostels', label: 'footer.links.properties.hostels' },
    {
      id: 13,
      href: 'bed-and-breakfast',
      label: 'footer.links.properties.bedAndBreakfast',
    },
    {
      id: 14,
      href: 'guest-house',
      label: 'footer.links.properties.guestHouses',
    },
    {
      id: 15,
      href: 'accommodations',
      label: 'footer.links.properties.unique',
    },
    { id: 16, href: 'destination', label: 'footer.links.explore.destinations' },
    { id: 17, href: 'flights', label: 'footer.links.explore.flights' },
    { id: 18, href: 'cars', label: 'footer.links.explore.cars' },
    { id: 19, href: 'holidays', label: 'footer.links.explore.vacations' },
    { id: 20, href: 'discover', label: 'footer.links.explore.discover' },
    { id: 21, href: 'reviews', label: 'footer.links.explore.reviews' },
    {
      id: 22,
      href: 'extended-stays',
      label: 'footer.links.explore.monthlyStays',
    },
  ];

  return (
    <Container>
      <Wrapper>
        <ul>
          {footerLinkItems.map((item) => (
            <li key={item.id}>
              <Link $size="xs" $underline="hover" href={item.href}>
                {t(item.label)}
              </Link>
            </li>
          ))}
        </ul>
      </Wrapper>
    </Container>
  );
};
