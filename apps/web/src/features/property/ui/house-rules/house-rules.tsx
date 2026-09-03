// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { HouseRulesCard } from '@/entities/property/ui/house-rules-card';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Heading, Text } from '@/shared/ui';

import { TitleGroup } from '../hotel-area/hotel-area.styled';

import { Wrapper } from './house-rules.styled';

import type { HouseRulesProps } from './house-rules.types';
import type { FC } from 'react';

export const HouseRules: FC<HouseRulesProps> = ({
  rules,
  propertyName,
  checkInOutRange,
}) => {
  const { t } = useTranslation('property');

  return (
    <Wrapper>
      <TitleGroup id="house_rules">
        <Heading $size="2xl" as="h2">
          {t('houseRules.title')}
        </Heading>
        <ButtonLink $color="blue" $size="sm" href="#availability">
          {t('availability.actions.seeAvailability')}
        </ButtonLink>
      </TitleGroup>
      <Text
        $color="description"
        as="div"
        style={{ marginTop: '4px', marginBottom: '20px' }}
      >
        {t('houseRules.description', { propertyName })}
      </Text>
      <HouseRulesCard checkInOutRange={checkInOutRange} rules={rules} />
    </Wrapper>
  );
};
