// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ChevronDown, UserRound } from 'lucide-react';
import { useMemo } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Icon,
  Label,
  NumberInput,
  Popover,
  Separator,
  Switch,
  Text,
} from '@/shared/ui';

import {
  OccupancyContainer,
  OccupancyItem,
  PopoverButton,
} from './occupancy-picker.styled';

import type {
  OccupancyPickerProps,
  OccupancyValue,
} from './occupancy-picker.types';

export const OccupancyPicker = ({
  value,
  onChange,
  maxAdults = 30,
  maxRooms = 30,
  showApartmentOption = true,
  showPetOption = true,
  disabled = false,
}: OccupancyPickerProps) => {
  const { t } = useTranslation('search');

  const updateValue = (updates: Partial<OccupancyValue>) => {
    onChange({ ...value, ...updates });
  };

  const summaryText: string = useMemo(() => {
    return t('form.occupancy.summary', {
      adults: value.adult,
      children: value.children,
      rooms: value.room,
      ns: 'search',
    });
  }, [value.adult, value.children, value.room, t]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <PopoverButton disabled={disabled} type="button">
          <Icon icon={UserRound} />
          <Text $size="sm" aria-label="Occupancy summary" as="span">
            {summaryText}
          </Text>
          <Icon icon={ChevronDown} />
        </PopoverButton>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <OccupancyContainer>
            <OccupancyItem>
              <Label $size="sm" htmlFor="occ-adult">
                {t('form.occupancy.adults')}
              </Label>
              <NumberInput
                id="occ-adult"
                max={maxAdults}
                min={1}
                value={value.adult}
                onDecreaseClick={() =>
                  updateValue({ adult: Math.max(1, value.adult - 1) })
                }
                onIncreaseClick={() =>
                  updateValue({ adult: Math.min(maxAdults, value.adult + 1) })
                }
              />
            </OccupancyItem>

            <OccupancyItem>
              <Label $size="sm" htmlFor="occ-child">
                {t('form.occupancy.children')}
              </Label>
              <NumberInput
                id="occ-child"
                max={10}
                min={0}
                value={value.children}
                onDecreaseClick={() =>
                  updateValue({ children: Math.max(0, value.children - 1) })
                }
                onIncreaseClick={() =>
                  updateValue({ children: Math.min(10, value.children + 1) })
                }
              />
            </OccupancyItem>

            <OccupancyItem>
              <Label $size="sm" htmlFor="occ-room">
                {t('form.occupancy.rooms')}
              </Label>
              <NumberInput
                id="occ-room"
                max={maxRooms}
                min={1}
                value={value.room}
                onDecreaseClick={() =>
                  updateValue({ room: Math.max(1, value.room - 1) })
                }
                onIncreaseClick={() =>
                  updateValue({ room: Math.min(maxRooms, value.room + 1) })
                }
              />
            </OccupancyItem>

            {showApartmentOption || showPetOption ? <Separator /> : null}

            {showApartmentOption ? (
              <OccupancyItem>
                <Label $size="sm" htmlFor="occ-apt">
                  {t('form.occupancy.apartmentHint')}
                </Label>
                <Switch
                  $size="sm"
                  checked={Boolean(value.lookingForApartment)}
                  id="occ-apt"
                  onCheckedChange={(checked) =>
                    updateValue({ lookingForApartment: checked })
                  }
                />
              </OccupancyItem>
            ) : null}

            {showPetOption ? (
              <OccupancyItem>
                <Label $size="sm" htmlFor="occ-pets">
                  {t('form.occupancy.pets')}
                </Label>
                <Switch
                  $size="sm"
                  checked={Boolean(value.withPets)}
                  id="occ-pets"
                  onCheckedChange={(checked) =>
                    updateValue({ withPets: checked })
                  }
                />
              </OccupancyItem>
            ) : null}

            <Popover.Close asChild aria-label="done">
              <Button
                $color="blue"
                $variant="outline"
                style={{ marginTop: '8px' }}
              >
                {t('actions.done')}
              </Button>
            </Popover.Close>
          </OccupancyContainer>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
