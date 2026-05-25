// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { ButtonLink, Container, Heading, Text } from '@/shared/ui';

import { BackgroundOverlay, BannerImage, Content } from './hero-banner.styled';

export const HeroBanner = async () => {
  const { t } = await getTranslation('home');

  return (
    <>
      <BackgroundOverlay />
      <BannerImage
        alt=""
        height="868"
        src="/assets/images/hero_1.jpeg"
        width="2880"
      />
      <Content>
        <Container>
          <Heading $color="white" $size="5xl" $weight="extrabold" as="h1">
            {t('hero.headingLine1')}
            <br />
            {t('hero.headingLine2')}
          </Heading>
          <Text $color="white" $size="2xl" as="p" style={{ marginTop: '10px' }}>
            {t('hero.subHeading')}
          </Text>
          <ButtonLink
            $color="blue"
            $size="lg"
            $variant="solid"
            href="/"
            style={{ marginTop: '30px', padding: '14px' }}
          >
            {t('hero.cta')}
          </ButtonLink>
        </Container>
      </Content>
    </>
  );
};
