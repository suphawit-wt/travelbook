// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Card, Heading, Text } from '@/shared/ui';

import { TitleGroup } from '../hotel-area/hotel-area.styled';

import { Wrapper } from './fine-print.styled';

export const FinePrint = () => {
  const { t } = useTranslation('property');

  return (
    <Wrapper>
      <TitleGroup id="fine_print">
        <Heading $size="2xl" as="h2">
          {t('finePrint.title')}
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
        {t('finePrint.description')}
      </Text>
      <Card.Root $padding="lg" $variant="surface">
        <Text $size="sm">{t('finePrint.noParties')}</Text>
      </Card.Root>
    </Wrapper>
  );
};
