// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { CircleUserRound, HelpCircle } from 'lucide-react';

import { MobileNav } from '@/entities/nav/ui/mobile-nav';
import { MobileUserProfileButton } from '@/entities/user/ui/mobile-user-profile-button';
import { UserProfileButton } from '@/entities/user/ui/user-profile-button';
import { selectIsAuthenticated } from '@/features/auth/store/auth.selectors';
import { CurrencySelector } from '@/features/currency/ui/currency-selector';
import { LanguageSelector } from '@/features/i18n/ui/language-selector';
import { ThemeSwitch } from '@/features/theme/ui/theme-switch';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, IconButtonLink, Link, Logo } from '@/shared/ui';

import { Nav, Wrapper } from './header-bar.styled';

export const HeaderBar = () => {
  const { t } = useTranslation('common');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Wrapper>
      <Link href="/">
        <Logo $color="white" $size="md" />
      </Link>

      <Nav $showOnly="desktop">
        <ul>
          <li>
            <CurrencySelector />
          </li>

          <li>
            <LanguageSelector />
          </li>

          <li>
            <ThemeSwitch />
          </li>

          <li>
            <IconButtonLink
              $pressEffect="scale"
              $variant="ghost"
              aria-label="customer support link"
              href="help"
              icon={HelpCircle}
              tooltip={t('header.topBar.help.tooltip')}
            />
          </li>

          <li>
            <ButtonLink $pressEffect="scale" $variant="ghost" href="join">
              {t('header.topBar.listProperty')}
            </ButtonLink>
          </li>

          {!isAuthenticated ? (
            <>
              <li>
                <ButtonLink
                  $color="blue"
                  $pressEffect="scale"
                  $size="sm"
                  $variant="soft"
                  href="auth/sign-in"
                >
                  {t('header.topBar.register')}
                </ButtonLink>
              </li>

              <li>
                <ButtonLink
                  $color="blue"
                  $pressEffect="scale"
                  $size="sm"
                  $variant="soft"
                  href="auth/sign-in"
                >
                  {t('header.topBar.signIn')}
                </ButtonLink>
              </li>
            </>
          ) : (
            <li>
              <UserProfileButton />
            </li>
          )}
        </ul>
      </Nav>

      <Nav $showOnly="mobile">
        <ul>
          {!isAuthenticated ? (
            <li>
              <IconButtonLink
                $variant="ghost"
                href="auth/sign-in"
                icon={CircleUserRound}
              />
            </li>
          ) : (
            <li>
              <MobileUserProfileButton />
            </li>
          )}

          <li>
            <MobileNav />
          </li>
        </ul>
      </Nav>
    </Wrapper>
  );
};
