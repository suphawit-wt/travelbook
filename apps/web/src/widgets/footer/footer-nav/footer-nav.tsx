// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { APP } from '@/shared/constants/app';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Accordion, Link, Text } from '@/shared/ui';

import { Content, NavContainer, Wrapper } from './footer-nav.styled';

import type { NavItemsType } from './footer-nav.types';

export const FooterNav = async () => {
  const { t } = await getTranslation('common');

  const footerNavItems: NavItemsType[] = [
    {
      id: 100,
      title: t('footer.sections.support.title'),
      links: [
        {
          id: 51,
          href: 'covid-19',
          label: t('footer.sections.support.links.covid'),
        },
        {
          id: 52,
          href: 'trips',
          label: t('footer.sections.support.links.trips'),
        },
        {
          id: 53,
          href: 'help',
          label: t('footer.sections.support.links.contact'),
        },
        {
          id: 54,
          href: 'trust-and-safety',
          label: t('footer.sections.support.links.safety'),
        },
      ],
    },
    {
      id: 200,
      title: t('footer.sections.discover.title'),
      links: [
        {
          id: 55,
          href: 'genius',
          label: t('footer.sections.discover.links.genius'),
        },
        {
          id: 56,
          href: 'deals',
          label: t('footer.sections.discover.links.deals'),
        },
        {
          id: 57,
          href: 'articles',
          label: t('footer.sections.discover.links.articles'),
        },
        {
          id: 58,
          href: 'bussiness',
          label: t('footer.sections.discover.links.business', {
            appName: APP.name,
          }),
        },
        {
          id: 59,
          href: 'traveller-awards',
          label: t('footer.sections.discover.links.awards'),
        },
        {
          id: 60,
          href: 'cars',
          label: t('footer.sections.discover.links.cars'),
        },
        {
          id: 61,
          href: 'flights',
          label: t('footer.sections.discover.links.flights'),
        },
        {
          id: 62,
          href: 'https://opentable.com',
          label: t('footer.sections.discover.links.restaurants'),
        },
        {
          id: 63,
          href: 'affiliate-program',
          label: t('footer.sections.discover.links.affiliate', {
            appName: APP.name,
          }),
        },
      ],
    },
    {
      id: 300,
      title: t('footer.sections.legal.title'),
      links: [
        {
          id: 64,
          href: 'content/privacy',
          label: t('footer.sections.legal.links.privacy'),
        },
        {
          id: 65,
          href: 'content/terms',
          label: t('footer.sections.legal.links.terms'),
        },
        {
          id: 66,
          href: 'content/complaints',
          label: t('footer.sections.legal.links.complaints'),
        },
        {
          id: 67,
          href: 'modern-slavery-statement',
          label: t('footer.sections.legal.links.modernSlavery'),
        },
        {
          id: 68,
          href: 'about/compliance-and-ethics/human-rights',
          label: t('footer.sections.legal.links.humanRights'),
        },
      ],
    },
    {
      id: 400,
      title: t('footer.sections.partner.title'),
      links: [
        {
          id: 69,
          href: 'admin',
          label: t('footer.sections.partner.links.admin'),
        },
        {
          id: 70,
          href: 'partner',
          label: t('footer.sections.partner.links.help'),
        },
        {
          id: 71,
          href: 'join',
          label: t('footer.sections.partner.links.join'),
        },
        {
          id: 72,
          href: 'affiliate-program',
          label: t('footer.sections.partner.links.affiliate'),
        },
      ],
    },
    {
      id: 500,
      title: t('footer.sections.about.title'),
      links: [
        {
          id: 73,
          href: 'general',
          label: t('footer.sections.about.links.about', { appName: APP.name }),
        },
        {
          id: 74,
          href: 'content/how-we-work',
          label: t('footer.sections.about.links.howWeWork'),
        },
        {
          id: 75,
          href: 'sustainability',
          label: t('footer.sections.about.links.sustainability'),
        },
        { id: 76, href: 'news', label: t('footer.sections.about.links.press') },
        {
          id: 77,
          href: 'careers',
          label: t('footer.sections.about.links.careers'),
        },
        {
          id: 78,
          href: 'investor',
          label: t('footer.sections.about.links.investor'),
        },
        {
          id: 79,
          href: 'content/contact-us',
          label: t('footer.sections.about.links.contact'),
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <NavContainer $showOnly="desktop">
        {footerNavItems.map((nav) => (
          <Content key={nav.id}>
            <Text $size="sm" $weight="bold" as="span">
              {nav.title}
            </Text>
            <ul>
              {nav.links.map((link) => (
                <li key={link.id}>
                  <Link $size="sm" $underline="hover" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Content>
        ))}
      </NavContainer>

      <NavContainer $showOnly="mobile">
        <Accordion.Root type="multiple">
          {footerNavItems.map((nav) => (
            <Accordion.Item key={nav.id} value={nav.title}>
              <Accordion.Trigger>{nav.title}</Accordion.Trigger>
              <Accordion.Content asChild>
                <ul>
                  {nav.links.map((link) => (
                    <li key={link.id}>
                      <Link $size="sm" $underline="hover" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </NavContainer>
    </Wrapper>
  );
};
