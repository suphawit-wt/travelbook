// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Trans } from 'react-i18next/TransWithoutContext';

import { APP } from '@/shared/constants/app';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Link, Separator, Text } from '@/shared/ui';

import { AuthFlow } from './auth-flow/auth-flow';
import { Footer, Wrapper } from './auth-sign-in.styled';

export const AuthSignIn = async () => {
  const { t } = await getTranslation('common');

  return (
    <Wrapper>
      <AuthFlow />
      <Footer>
        <Separator style={{ marginBottom: '16px' }} />
        <Text $align="center" $size="xs">
          <Trans
            i18nKey="footer.legal.agreement"
            t={t}
            components={[
              // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
              <Link $color="blue" $underline="hover" href="content/terms" />,
              // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
              <Link $color="blue" $underline="hover" href="content/privacy" />,
            ]}
          />
        </Text>
        <Text $align="center" $size="xs" style={{ marginTop: '16px' }}>
          {t('footer.legal.rights')}
        </Text>
        <Text $align="center" $size="xs">
          {t('footer.legal.copyright', {
            appName: APP.name,
            currentYear: new Date().getFullYear(),
          })}
        </Text>
      </Footer>
    </Wrapper>
  );
};
