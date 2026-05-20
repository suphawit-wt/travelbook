// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { CurrencySelector } from '@/features/currency/ui/currency-selector';
import { LanguageSelector } from '@/features/i18n/ui/language-selector';
import { ThemeSwitch } from '@/features/theme/ui/theme-switch';
import { APP } from '@/shared/constants/app';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Container, Image, Separator, Text } from '@/shared/ui';

import { Content, Control, LogoGroup, Wrapper } from './footer-info.styled';

export const FooterInfo = async () => {
  const { t } = await getTranslation('common');

  return (
    <Wrapper>
      <Container>
        <Control>
          <LanguageSelector />
          <CurrencySelector />
          <ThemeSwitch />
        </Control>
        <Separator />
        <Content>
          <div>
            <Text $align="center" $color="description" $size="xs" as="p">
              {t('footer.info.description', {
                appName: APP.name,
                appCompanyName: APP.company.name,
              })}
            </Text>
            <Text $align="center" $color="description" $size="xs" as="p">
              {t('footer.info.copyright', {
                appName: APP.name,
                currentYear: new Date().getFullYear(),
              })}
            </Text>
          </div>
          <LogoGroup>
            <Image
              alt="travelbook"
              height="80"
              src="/assets/images/brands/logo.svg"
              width="80"
            />
            <Image
              alt="pricelive"
              height="70"
              src="/assets/images/brands/pricelive.svg"
              width="70"
            />
            <Image
              alt="kayay"
              height="80"
              src="/assets/images/brands/kayay.svg"
              width="80"
            />
            <Image
              alt="aloha"
              height="40"
              src="/assets/images/brands/aloha.svg"
              width="40"
            />
            <Image
              alt="openfood"
              height="80"
              src="/assets/images/brands/openfood.svg"
              width="80"
            />
          </LogoGroup>
        </Content>
      </Container>
    </Wrapper>
  );
};
