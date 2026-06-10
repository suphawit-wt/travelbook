// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Button, Heading, Image, Link } from '@/shared/ui';

import {
  Content,
  ContentWrapper,
  ImageContainer,
  Wrapper,
  YellowCircle,
} from './discover-homes.styled';

export const DiscoverHomes = async () => {
  const { t } = await getTranslation('home');

  return (
    <Wrapper>
      <Link href="booking-home">
        <YellowCircle />
        <ContentWrapper>
          <ImageContainer>
            <Image
              alt="Cat sit on chair"
              height={471}
              src="/assets/images/discover_homes_01.png"
              width={714}
            />
          </ImageContainer>
          <Content>
            <div>
              <Heading $size="md" $weight="bold" as="h3">
                {t('discoverHomes.find')}
              </Heading>
              <div>
                <ul>
                  <li>{t('discoverHomes.apartments')}</li>
                  <li>{t('discoverHomes.villas')}</li>
                  <li>{t('discoverHomes.condoHotels')}</li>
                  <li>{t('discoverHomes.vacationHomes')}</li>
                  <li>{t('discoverHomes.cottages')}</li>
                  <li>{t('discoverHomes.homes')}</li>
                  <li>{t('discoverHomes.apartments')}</li>
                </ul>
              </div>
              <Heading $size="md" $weight="bold" as="h3">
                {t('discoverHomes.forYourNextTrip')}
              </Heading>
            </div>
            <Button
              $color="blue"
              $size="sm"
              $variant="outline"
              style={{ marginTop: '14px' }}
            >
              {t('discoverHomes.cta')}
            </Button>
          </Content>
        </ContentWrapper>
      </Link>
    </Wrapper>
  );
};
