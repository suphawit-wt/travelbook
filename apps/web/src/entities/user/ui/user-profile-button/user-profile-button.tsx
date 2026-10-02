// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Briefcase,
  Gem,
  Heart,
  LogOut,
  Star,
  UserRound,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';

import { AuthService } from '@/features/auth/lib/auth.service';
import { clearAuth } from '@/features/auth/store/auth.slice';
import { useNavbarInfo } from '@/features/user/hooks/use-navbar-info';
import { selectUserAvatar } from '@/features/user/store/user-preferences.selectors';
import { setAvatar } from '@/features/user/store/user-preferences.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, ButtonLink, DropdownMenu, Image, Text } from '@/shared/ui';

import {
  ProfileAvatar,
  ProfileInfo,
  ProfileMenu,
} from './user-profile-button.styled';

import type { NavLink } from './user-profile-button.types';

export const UserProfileButton: FC = () => {
  const authService = new AuthService();

  const { t } = useTranslation('account');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navbarInfo = useNavbarInfo();
  const userAvatar = useAppSelector(selectUserAvatar);

  useEffect(() => {
    if (navbarInfo?.avatarUrl) {
      dispatch(setAvatar(navbarInfo.avatarUrl));
    }
  }, [navbarInfo, dispatch]);

  const profileNavLinks: NavLink[] = [
    {
      id: 'link-myaccount',
      title: t('userMenu.nav.account', { ns: 'account' }),
      link: 'myaccount',
      icon: UserRound,
    },
    {
      id: 'link-myreservations',
      title: t('userMenu.nav.bookings', { ns: 'account' }),
      link: 'myreservations',
      icon: Briefcase,
    },
    {
      id: 'link-genius',
      title: t('userMenu.nav.genius', { ns: 'account' }),
      link: 'genius',
      icon: Gem,
    },
    {
      id: 'link-rewards-and-wallet',
      title: t('userMenu.nav.rewards', { ns: 'account' }),
      link: 'rewards-and-wallet',
      icon: Wallet,
    },
    {
      id: 'link-review-timeline',
      title: t('userMenu.nav.reviews', { ns: 'account' }),
      link: 'review-timeline',
      icon: Star,
    },
    {
      id: 'link-mywishlist',
      title: t('userMenu.nav.saved', { ns: 'account' }),
      link: 'mywishlist',
      icon: Heart,
    },
  ];

  const onSignOut = async () => {
    try {
      await authService.userSignOut();
      dispatch(clearAuth());
      router.refresh();
    } catch (err) {
      console.error('Signout failed', err);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button $size="sm" $variant="ghost">
          <ProfileMenu>
            <ProfileAvatar>
              <Image
                $shape="circle"
                alt="Profile Avatar"
                height="28"
                src={userAvatar}
                width="28"
              />
            </ProfileAvatar>
            <ProfileInfo>
              <Text $size="sm" $weight="bold">
                {t('userMenu.title', { ns: 'account' })}
              </Text>
              <Text $color="yellow" $size="xs">
                {t('userMenu.geniusLevel', {
                  ns: 'account',
                  tier: navbarInfo?.geniusTier,
                })}
              </Text>
            </ProfileInfo>
          </ProfileMenu>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {profileNavLinks.map(({ id, title, link, icon }) => (
            <DropdownMenu.Item key={id} asChild>
              <ButtonLink
                $size="sm"
                $variant="ghost"
                href={link}
                startIcon={icon}
              >
                {title}
              </ButtonLink>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Item asChild>
            <Button
              $size="sm"
              $variant="ghost"
              startIcon={LogOut}
              style={{ justifyContent: 'normal' }}
              onClick={onSignOut}
            >
              {t('userMenu.nav.signOut', { ns: 'account' })}
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
