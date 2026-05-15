// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Book,
  CheckCircle2,
  Cookie,
  FileText,
  Gem,
  Handshake,
  HelpCircle,
  Home,
  Info,
  Newspaper,
  Percent,
  Scale,
  Smartphone,
  UserRoundSearch,
} from 'lucide-react';

import { APP } from '@/shared/constants/app';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Text } from '@/shared/ui';

import { Wrapper } from './nav-dialog.styled';

import type { NavDialogProps, NavSection } from './nav-dialog.types';
import type { FC } from 'react';

export const NavDialog: FC<NavDialogProps> = (props) => {
  const { t } = useTranslation('common');

  const navSections: NavSection[] = [
    {
      id: 'helpSupport',
      title: t('mobile.support.title'),
      links: [
        {
          id: 'help',
          href: 'secure/help',
          icon: HelpCircle,
          label: t('mobile.support.contact'),
        },
        {
          id: 'dispute',
          href: 'secure/dispute-resolution',
          icon: Handshake,
          label: t('mobile.support.partner'),
        },
      ],
    },
    {
      id: 'inspiration',
      title: t('mobile.inspiration.title'),
      links: [
        {
          id: 'deals',
          href: 'deals',
          icon: Percent,
          label: t('mobile.inspiration.deals'),
        },
        {
          id: 'articles',
          href: 'articles',
          icon: Book,
          label: t('mobile.inspiration.articles'),
        },
      ],
    },
    {
      id: 'setting',
      title: t('mobile.settings.title'),
      links: [
        {
          id: 'about',
          href: 'content/about',
          icon: Info,
          label: t('mobile.settings.about', { appName: APP.name }),
        },
        {
          id: 'careers',
          href: 'careers',
          icon: UserRoundSearch,
          label: t('mobile.settings.careers'),
        },
        {
          id: 'affiliate',
          href: 'affiliate-program',
          icon: CheckCircle2,
          label: t('mobile.settings.affiliate'),
        },
        {
          id: 'press',
          href: 'news',
          icon: Newspaper,
          label: t('mobile.settings.press'),
        },
        {
          id: 'privacy',
          href: 'content/privacy',
          icon: Cookie,
          label: t('mobile.settings.privacy'),
        },
        {
          id: 'terms',
          href: 'content/terms',
          icon: FileText,
          label: t('mobile.settings.terms'),
        },
        {
          id: 'legal',
          href: 'content/legal',
          icon: Scale,
          label: t('mobile.settings.legal'),
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <nav>
        <ul>
          <li>
            <ButtonLink
              $size="sm"
              $variant="ghost"
              href="mobile-app"
              startIcon={Smartphone}
            >
              {t('mobile.menu.app')}
            </ButtonLink>
          </li>

          <li>
            <ButtonLink
              $size="sm"
              $variant="ghost"
              href="genius"
              startIcon={Gem}
            >
              {t('mobile.menu.genius')}
            </ButtonLink>
          </li>

          <li>
            <ButtonLink
              $size="sm"
              $variant="ghost"
              href="join"
              startIcon={Home}
            >
              {t('mobile.menu.listProperty')}
            </ButtonLink>
          </li>
        </ul>
      </nav>

      {navSections.map((section) => (
        <nav key={section.id}>
          <Text $weight="semibold" as="span">
            {section.title}
          </Text>
          <ul>
            {section.links.map((link) => (
              <li key={link.id}>
                <ButtonLink
                  $size="sm"
                  $variant="ghost"
                  href={link.href}
                  startIcon={link.icon}
                >
                  {link.label}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </Wrapper>
  );
};
