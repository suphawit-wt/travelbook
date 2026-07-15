// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Checkbox, Label, Text } from '@/shared/ui';

import { Group, Item } from '../../filter-sidebar.styled';

export const PropertyTypeFilter = () => {
  const { t } = useTranslation('search');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.propertyType.title')}
      </Text>

      {/* Resorts */}
      <Item>
        <Label
          $size="sm"
          htmlFor="property-type-resorts"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="property-type-resorts" />
          <Text>{t('filters.groups.propertyType.options.resorts')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Hotels */}
      <Item>
        <Label
          $size="sm"
          htmlFor="property-type-hotels"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="property-type-hotels" />
          <Text>{t('filters.groups.propertyType.options.hotels')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Apartments and Homes */}
      <Item>
        <Label
          $size="sm"
          htmlFor="property-type-apartments-homes"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="property-type-apartments-homes" />
          <Text>
            {t('filters.groups.propertyType.options.apartmentsAndHomes')}
          </Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Guest Houses */}
      <Item>
        <Label
          $size="sm"
          htmlFor="property-type-guest-houses"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="property-type-guest-houses" />
          <Text>{t('filters.groups.propertyType.options.guestHouses')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Bed and Breakfast (BnB) */}
      <Item>
        <Label
          $size="sm"
          htmlFor="property-type-bnb"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="property-type-bnb" />
          <Text>{t('filters.groups.propertyType.options.bnb')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* --- Collapsible Items Segment (Remaining 7 Items) --- */}
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Content>
          {/* Villas */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-villas"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-villas" />
              <Text>{t('filters.groups.propertyType.options.villas')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Vacation Homes */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-vacation-homes"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-vacation-homes" />
              <Text>
                {t('filters.groups.propertyType.options.vacationHomes')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Homestays */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-homestays"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-homestays" />
              <Text>{t('filters.groups.propertyType.options.homestays')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Apartments */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-apartments"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-apartments" />
              <Text>{t('filters.groups.propertyType.options.apartments')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Hostels */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-hostels"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-hostels" />
              <Text>{t('filters.groups.propertyType.options.hostels')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Campgrounds */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-campgrounds"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-campgrounds" />
              <Text>
                {t('filters.groups.propertyType.options.campgrounds')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Country Houses */}
          <Item>
            <Label
              $size="sm"
              htmlFor="property-type-country-houses"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="property-type-country-houses" />
              <Text>
                {t('filters.groups.propertyType.options.countryHouses')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>
        </Collapsible.Content>

        <Collapsible.Trigger asChild>
          <Button
            $color="blue"
            $size="sm"
            $variant="link"
            endIcon={isOpen ? ChevronUp : ChevronDown}
            style={{ marginTop: '10px', padding: 0 }}
          >
            {isOpen
              ? t('actions.showLess')
              : t('actions.showAll', { count: 12 })}
          </Button>
        </Collapsible.Trigger>
      </Collapsible.Root>
    </Group>
  );
};
