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

export const FacilitiesFilter = () => {
  const { t } = useTranslation('search');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.facilities.title')}
      </Text>

      {/* Parking */}
      <Item>
        <Label
          $size="sm"
          htmlFor="facility-parking"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="facility-parking" />
          <Text>{t('filters.groups.facilities.options.parking')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Restaurant */}
      <Item>
        <Label
          $size="sm"
          htmlFor="facility-restaurant"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="facility-restaurant" />
          <Text>{t('filters.groups.facilities.options.restaurant')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Pets */}
      <Item>
        <Label
          $size="sm"
          htmlFor="facility-pets"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="facility-pets" />
          <Text>{t('filters.groups.facilities.options.pets')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Room Service */}
      <Item>
        <Label
          $size="sm"
          htmlFor="facility-room-service"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="facility-room-service" />
          <Text>{t('filters.groups.facilities.options.roomService')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* 24h Front Desk */}
      <Item>
        <Label
          $size="sm"
          htmlFor="facility-front-desk"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="facility-front-desk" />
          <Text>{t('filters.groups.facilities.options.frontDesk24h')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* --- Collapsible Items Segment (Remaining 7 Items) --- */}
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Content>
          {/* Non Smoking */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-non-smoking"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-non-smoking" />
              <Text>{t('filters.groups.facilities.options.nonSmoking')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Airport Shuttle */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-airport-shuttle"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-airport-shuttle" />
              <Text>
                {t('filters.groups.facilities.options.airportShuttle')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Family Rooms */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-family-rooms"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-family-rooms" />
              <Text>{t('filters.groups.facilities.options.familyRooms')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Hot Tub */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-hot-tub"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-hot-tub" />
              <Text>{t('filters.groups.facilities.options.hotTub')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Wi-Fi */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-wifi"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-wifi" />
              <Text>{t('filters.groups.facilities.options.wifi')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Wheelchair Accessible */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-wheelchair"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-wheelchair" />
              <Text>{t('filters.groups.facilities.options.wheelchair')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Swimming Pool */}
          <Item>
            <Label
              $size="sm"
              htmlFor="facility-pool"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="facility-pool" />
              <Text>{t('filters.groups.facilities.options.pool')}</Text>
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
