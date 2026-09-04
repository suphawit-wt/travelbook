// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ChevronDown } from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Accordion, Icon, Link, Text } from '@/shared/ui';

import {
  PlacesGroup,
  PlacesItem,
  PlacesLinkGroup,
  StyledAccordionTrigger,
  Wrapper,
} from './best-of-places.styled';

import type { PlaceSection } from './best-of-places.types';

export const BestOfPlaces = () => {
  const { t } = useTranslation('property');

  const destination = 'Bangkok';

  const placesSections: PlaceSection[] = [
    {
      id: 'cities',
      title: t('bestOf.categories.cities'),
      links: [
        { id: 'pattaya', label: 'Pattaya', href: 'places/pattaya' },
        { id: 'jomtien', label: 'Jomtien Beach', href: 'places/pattaya' },
        { id: 'ko-larn', label: 'Ko Larn', href: 'places/pattaya' },
        { id: 'si-racha', label: 'Si Racha', href: 'places/pattaya' },
        { id: 'pattaya-south', label: 'Pattaya South', href: 'places/pattaya' },
      ],
    },
    {
      id: 'airports',
      title: t('bestOf.categories.airports'),
      links: [
        {
          id: 'utapao',
          label: 'U-Tapao Rayong-Pattaya International Airport',
          href: 'places/pattaya',
        },
        {
          id: 'suvarnabhumi',
          label: 'Suvarnabhumi Airport',
          href: 'places/pattaya',
        },
      ],
    },
    {
      id: 'landmarks',
      title: t('bestOf.categories.landmarks'),
      links: [
        {
          id: 'walking-street',
          label: 'Pattaya Walking Street',
          href: 'places/pattaya',
        },
        {
          id: 'siam-cc',
          label: 'Siam Country Club Pattaya',
          href: 'places/pattaya',
        },
        {
          id: 'terminal-21',
          label: 'Terminal 21 Pattaya',
          href: 'places/pattaya',
        },
        { id: 'bali-hai', label: 'Bali Hai Pier', href: 'places/pattaya' },
        { id: 'ko-phai', label: 'Ko Phai', href: 'places/pattaya' },
        {
          id: 'nong-nooch',
          label: 'Nong Nooch Tropical Botanical Garden',
          href: 'places/pattaya',
        },
        {
          id: 'central-festival',
          label: 'Central Festival Pattaya Beach',
          href: 'places/pattaya',
        },
        { id: 'ban-phe', label: 'Ban Phe Pier', href: 'places/pattaya' },
        { id: 'jomtien-beach', label: 'Jomtien Beach', href: 'places/pattaya' },
        {
          id: 'naval-base',
          label: 'Sattahip Naval Base',
          href: 'places/pattaya',
        },
        {
          id: 'royal-garden',
          label: 'Royal Garden Plaza',
          href: 'places/pattaya',
        },
        {
          id: 'ramayana',
          label: 'RamaYana Water Park',
          href: 'places/pattaya',
        },
        {
          id: 'amata-city',
          label: 'Amata City Industrial Park',
          href: 'places/pattaya',
        },
        {
          id: 'laem-chabang',
          label: 'Laem Chabang Industrial Estate',
          href: 'places/pattaya',
        },
        {
          id: 'sports-center',
          label:
            'Eastern National Sports Training Center, Pattaya Sports Stadium',
          href: 'places/pattaya',
        },
        {
          id: 'bus-terminal',
          label: 'Pattaya Bus Terminal',
          href: 'places/pattaya',
        },
        {
          id: 'old-course',
          label: 'Siam Country Club Pattaya OLD COURSE',
          href: 'places/pattaya',
        },
        {
          id: 'hospital',
          label: 'Bangkok Pattaya Hospital',
          href: 'places/pattaya',
        },
        {
          id: 'golf-club',
          label: 'Bangpra International Golf Club',
          href: 'places/pattaya',
        },
        { id: 'mini-siam', label: 'Mini Siam', href: 'places/pattaya' },
      ],
    },
  ];

  return (
    <Wrapper>
      <Accordion.Root collapsible type="single">
        <Accordion.Item value="one">
          <StyledAccordionTrigger>
            <div>
              <Text
                $color="black"
                $size="md"
                as="div"
                style={{ marginBottom: '6px' }}
              >
                {t('bestOf.title', { destination })}
              </Text>
              <Text $color="description" $size="xs" as="div">
                {t('bestOf.description', { destination })}
              </Text>
            </div>
            <Icon $color="black" icon={ChevronDown} />
          </StyledAccordionTrigger>
          <Accordion.Content asChild>
            <PlacesGroup>
              {placesSections.map((section) => (
                <PlacesItem key={section.id}>
                  <Text $size="sm" $weight="bold">
                    {section.title}
                  </Text>
                  <PlacesLinkGroup>
                    {section.links.map((link) => (
                      <li key={link.id}>
                        <Link
                          $color="blue"
                          $size="sm"
                          $underline="hover"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </PlacesLinkGroup>
                </PlacesItem>
              ))}
            </PlacesGroup>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Wrapper>
  );
};
