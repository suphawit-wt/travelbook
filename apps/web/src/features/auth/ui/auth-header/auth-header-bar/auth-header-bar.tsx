// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { HelpCircle } from 'lucide-react';

import { MobileNav } from '@/entities/nav/ui/mobile-nav';
import { LanguageSelector } from '@/features/i18n/ui/language-selector';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { IconButtonLink, Link, Logo } from '@/shared/ui';

import { Nav, Wrapper } from './auth-header-bar.styled';

export const AuthHeaderBar = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper>
      <Link href="/">
        <Logo $color="white" $size="md" />
      </Link>

      <Nav $showOnly="desktop">
        <ul>
          <li>
            <LanguageSelector />
          </li>

          <li>
            <IconButtonLink
              $size="md"
              $variant="ghost"
              aria-label="customer support link"
              href="help"
              icon={HelpCircle}
              tooltip={t('header.topBar.help.tooltip')}
            />
          </li>
        </ul>
      </Nav>

      <Nav $showOnly="mobile">
        <ul>
          <li>
            <MobileNav variant="auth" />
          </li>
        </ul>
      </Nav>
    </Wrapper>
  );
};
