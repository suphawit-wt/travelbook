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

export const RoomFacilitiesFilter = () => {
  const { t } = useTranslation('search');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Group>
      <Text $size="sm" $weight="bold">
        {t('filters.groups.roomFeatures.title')}
      </Text>

      {/* Sea View */}
      <Item>
        <Label
          $size="sm"
          htmlFor="room-fac-sea-view"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="room-fac-sea-view" />
          <Text>{t('filters.groups.roomFeatures.options.seaView')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Air Conditioning */}
      <Item>
        <Label
          $size="sm"
          htmlFor="room-fac-air-conditioning"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="room-fac-air-conditioning" />
          <Text>
            {t('filters.groups.roomFeatures.options.airConditioning')}
          </Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Bathtub */}
      <Item>
        <Label
          $size="sm"
          htmlFor="room-fac-bathtub"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="room-fac-bathtub" />
          <Text>{t('filters.groups.roomFeatures.options.bathtub')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Balcony */}
      <Item>
        <Label
          $size="sm"
          htmlFor="room-fac-balcony"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="room-fac-balcony" />
          <Text>{t('filters.groups.roomFeatures.options.balcony')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* Washing Machine */}
      <Item>
        <Label
          $size="sm"
          htmlFor="room-fac-washing-machine"
          style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
        >
          <Checkbox id="room-fac-washing-machine" />
          <Text>{t('filters.groups.roomFeatures.options.washingMachine')}</Text>
        </Label>
        <Text $color="description" $size="xs">
          0
        </Text>
      </Item>

      {/* --- Collapsible Items Segment (Remaining 16 Items) --- */}
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Content>
          {/* Kitchen */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-kitchen"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-kitchen" />
              <Text>{t('filters.groups.roomFeatures.options.kitchen')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Towels */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-towels"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-towels" />
              <Text>{t('filters.groups.roomFeatures.options.towels')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Electric Kettle */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-electric-kettle"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-electric-kettle" />
              <Text>{t('filters.groups.roomFeatures.options.kettle')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Coffee/Tea */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-coffee-tea"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-coffee-tea" />
              <Text>{t('filters.groups.roomFeatures.options.coffee')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Safe */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-safe"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-safe" />
              <Text>{t('filters.groups.roomFeatures.options.safe')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Baby Gates */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-baby-gates"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-baby-gates" />
              <Text>{t('filters.groups.roomFeatures.options.babyGates')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Socket Covers */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-socket-covers"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-socket-covers" />
              <Text>
                {t('filters.groups.roomFeatures.options.socketCovers')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Lake View */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-lake-view"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-lake-view" />
              <Text>{t('filters.groups.roomFeatures.options.lakeView')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Mountain View */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-mountain-view"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-mountain-view" />
              <Text>
                {t('filters.groups.roomFeatures.options.mountainView')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* City View */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-city-view"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-city-view" />
              <Text>{t('filters.groups.roomFeatures.options.cityView')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Courtyard View */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-courtyard-view"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-courtyard-view" />
              <Text>
                {t('filters.groups.roomFeatures.options.courtyardView')}
              </Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Dining Area */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-dining-area"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-dining-area" />
              <Text>{t('filters.groups.roomFeatures.options.diningArea')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Minibar */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-minibar"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-minibar" />
              <Text>{t('filters.groups.roomFeatures.options.minibar')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Sofa Bed */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-sofa-bed"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-sofa-bed" />
              <Text>{t('filters.groups.roomFeatures.options.sofaBed')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Toilet */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-toilet"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-toilet" />
              <Text>{t('filters.groups.roomFeatures.options.toilet')}</Text>
            </Label>
            <Text $color="description" $size="xs">
              0
            </Text>
          </Item>

          {/* Bidet */}
          <Item>
            <Label
              $size="sm"
              htmlFor="room-fac-bidet"
              style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}
            >
              <Checkbox id="room-fac-bidet" />
              <Text>{t('filters.groups.roomFeatures.options.bidet')}</Text>
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
              : t('actions.showAll', { count: 21 })}
          </Button>
        </Collapsible.Trigger>
      </Collapsible.Root>
    </Group>
  );
};
