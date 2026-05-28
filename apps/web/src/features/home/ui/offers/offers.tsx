// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import type { Language } from '@/shared/types/store';
import { ButtonLink, Card, Heading, Image, Text } from '@/shared/ui';
import { formatLocalizedDate } from '@/shared/utils/date';

import { CardContent, Content, ImageRightWrapper } from './offers.styled';

export const Offers = async () => {
  const { t, i18n } = await getTranslation('home');
  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const currentYear = new Date().getFullYear();
  const endOfYear = new Date(currentYear, 11, 31);
  const discountEndDate = formatLocalizedDate(
    endOfYear,
    currentLanguage as Language,
    'full',
  );

  return (
    <section>
      <Heading $size="2xl" as="h2">
        {t('offers.heading')}
      </Heading>
      <Text
        $color="description"
        as="p"
        style={{ marginTop: '6px', justifyContent: 'center' }}
      >
        {t('offers.description')}
      </Text>
      <Content>
        <Card.Root $variant="surface">
          <CardContent $padding="xl">
            <div>
              <Text $size="xl" $weight="bold" as="span">
                {t('offers.item1.title')}
              </Text>
              <Text $size="sm" as="p" style={{ marginTop: '3px' }}>
                {t('offers.item1.description')}
              </Text>
              <ButtonLink
                $color="blue"
                $size="sm"
                $variant="solid"
                href="flights"
                style={{ marginTop: '16px' }}
              >
                {t('offers.item1.cta')}
              </ButtonLink>
            </div>
            <ImageRightWrapper>
              <Image
                alt="plane"
                height="120"
                src="/assets/images/plane.png"
                width="120"
              />
            </ImageRightWrapper>
          </CardContent>
        </Card.Root>
        <Card.Root
          $variant="surface"
          style={{
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Card.Content
            $padding="xl"
            style={{
              margin: 'auto 0',
            }}
          >
            <Text $color="white" $size="xl" $weight="bold" as="span">
              {t('offers.item2.title')}
            </Text>
            <Text $color="white" $size="sm" as="p" style={{ marginTop: '3px' }}>
              {t('offers.item2.description', {
                discount: '15',
                date: discountEndDate,
              })}
            </Text>
            <ButtonLink
              $color="blue"
              $size="sm"
              $variant="solid"
              href="deals"
              style={{ marginTop: '16px' }}
            >
              {t('offers.item2.cta')}
            </ButtonLink>
          </Card.Content>
          <Card.Image
            alt="offer 2"
            height="800"
            src="/assets/images/offer_2.jpeg"
            width="1200"
          />
        </Card.Root>
      </Content>
    </section>
  );
};
