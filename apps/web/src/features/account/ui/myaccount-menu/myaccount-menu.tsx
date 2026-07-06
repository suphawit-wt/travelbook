// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import {
  Bell,
  CreditCard,
  LockKeyhole,
  Settings2,
  UserRound,
  UserSquare,
  UsersRound,
} from 'lucide-react';

import { APP } from '@/shared/constants/app';
import { getTranslation } from '@/shared/i18n/hooks/get-translation';
import { Heading, Icon, Link, Text } from '@/shared/ui';

import {
  Card,
  CardContent,
  IconDisplay,
  MenuGroup,
  Wrapper,
} from './myaccount-menu.styled';

import type { MenuItem } from './myaccount-menu.types';

export const MyAccountMenu = async () => {
  const { t } = await getTranslation('account');

  const accountMenuItems: MenuItem[] = [
    {
      id: 'personal-deatails',
      href: 'myaccount/personal-details',
      icon: UserRound,
      title: t('personalDetails.title'),
      description: t('personalDetails.description'),
      actionText: t('personalDetails.action'),
    },
    {
      id: 'customize-preferences',
      href: 'myaccount/customize-preferences',
      icon: Settings2,
      title: t('preferences.title'),
      description: t('preferences.description'),
      actionText: t('preferences.action'),
    },
    {
      id: 'security-settings',
      href: 'myaccount/security-settings',
      icon: LockKeyhole,
      title: t('security.title'),
      description: t('security.description'),
      actionText: t('security.action'),
    },
    {
      id: 'payment-methods',
      href: 'myaccount/payment-methods',
      icon: CreditCard,
      title: t('payments.title'),
      description: t('payments.description'),
      actionText: t('payments.action'),
    },
    {
      id: 'privacy-data-management',
      href: 'myaccount/privacy-data-management',
      icon: UserSquare,
      title: t('privacy.title'),
      description: t('privacy.description'),
      actionText: t('privacy.action'),
    },
    {
      id: 'email-preferences',
      href: 'myaccount/email-preferences',
      icon: Bell,
      title: t('notifications.title'),
      description: t('notifications.description'),
      actionText: t('notifications.action'),
    },
    {
      id: 'other-travelers',
      href: 'myaccount/other-travelers',
      icon: UsersRound,
      title: t('travelers.title'),
      description: t('travelers.description'),
      actionText: t('travelers.action'),
    },
  ];

  return (
    <Wrapper>
      <Heading
        $size="2xl"
        $weight="bold"
        as="h1"
        style={{ marginBlockEnd: '10px' }}
      >
        {t('settings.title')}
      </Heading>
      <Text $color="description">
        {t('settings.description', { appName: APP.name })}
      </Text>

      <MenuGroup>
        {accountMenuItems.map((menu) => (
          <Link key={menu.id} href={menu.href}>
            <Card>
              <div>
                <IconDisplay>
                  <Icon icon={menu.icon} />
                </IconDisplay>
              </div>
              <CardContent>
                <Text $size="lg" $weight="bold">
                  {menu.title}
                </Text>
                <Text $size="sm">{menu.description}</Text>
                <Text
                  $color="blue"
                  $size="sm"
                  style={{ marginBlockStart: '4px' }}
                >
                  {menu.actionText}
                </Text>
              </CardContent>
            </Card>
          </Link>
        ))}
      </MenuGroup>
    </Wrapper>
  );
};
