// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { APP } from '@/shared/constants';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Container, Link, Text } from '@/shared/ui';

import { Nav, Wrapper } from './simple-footer.styled';

export const SimpleFooter = async () => {
  const { t } = await getTranslation('common');

  return (
    <Wrapper>
      <Container>
        <Nav>
          <ul>
            <li>
              <Link $size="sm" $weight="bold" href="about">
                {t('footer.booking.about', {
                  appName: APP.name,
                })}
              </Link>
            </li>
            <li>
              <Link $size="sm" $weight="bold" href="help">
                {t('footer.booking.help')}
              </Link>
            </li>
            <li>
              <Link $size="sm" $weight="bold" href="terms">
                {t('footer.booking.terms')}
              </Link>
            </li>
            <li>
              <Link $size="sm" $weight="bold" href="privacy">
                {t('footer.booking.privacy')}
              </Link>
            </li>
          </ul>
        </Nav>
        <Text $size="xs" as="p">
          {t('footer.info.copyright', {
            appName: APP.name,
            currentYear: new Date().getFullYear(),
          })}
        </Text>
      </Container>
    </Wrapper>
  );
};
