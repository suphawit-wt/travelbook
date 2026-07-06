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

import { AuthService } from '@/features/auth/lib/auth.service';
import { clearAuth } from '@/features/auth/store/auth.slice';
import { useNavbarInfo } from '@/features/user/hooks/use-navbar-info';
import { useAppDispatch } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, ButtonLink, Image, Text } from '@/shared/ui';

import {
  ProfileAvatar,
  ProfileInfo,
  ProfileMenu,
  Wrapper,
} from './mobile-user-profile-dialog.styled';

import type {
  MobileUserProfileDialogProps,
  NavLink,
} from './mobile-user-profile-dialog.types';
import type { FC } from 'react';

export const MobileUserProfileDialog: FC<MobileUserProfileDialogProps> = () => {
  const authService = new AuthService();

  const { t } = useTranslation('account');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navbarInfo = useNavbarInfo();

  const profileNavLinks: NavLink[] = [
    {
      id: 'link-myaccount',
      title: t('userMenu.nav.account'),
      link: 'myaccount',
      icon: UserRound,
    },
    {
      id: 'link-myreservations',
      title: t('userMenu.nav.bookings'),
      link: 'myreservations',
      icon: Briefcase,
    },
    {
      id: 'link-genius',
      title: t('userMenu.nav.genius'),
      link: 'genius',
      icon: Gem,
    },
    {
      id: 'link-rewards-and-wallet',
      title: t('userMenu.nav.rewards'),
      link: 'rewards-and-wallet',
      icon: Wallet,
    },
    {
      id: 'link-review-timeline',
      title: t('userMenu.nav.reviews'),
      link: 'review-timeline',
      icon: Star,
    },
    {
      id: 'link-mywishlist',
      title: t('userMenu.nav.saved'),
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
      // eslint-disable-next-line no-console -- for debug
      console.error('Signout failed', err);
    }
  };

  return (
    <Wrapper>
      <ProfileMenu>
        <ProfileAvatar>
          <Image
            $shape="circle"
            alt="Profile Avatar"
            height="28"
            src={navbarInfo?.avatarUrl ?? '/assets/images/avatar/default.png'}
            width="28"
          />
        </ProfileAvatar>
        <ProfileInfo>
          <Text $weight="bold">{t('userMenu.title')}</Text>
          <Text $color="green" $size="xs">
            {t('userMenu.geniusLevel', {
              tier: navbarInfo?.geniusTier,
            })}
          </Text>
        </ProfileInfo>
      </ProfileMenu>

      <nav>
        <ul>
          {profileNavLinks.map(({ id, title, link, icon }) => (
            <li key={id}>
              <ButtonLink
                $size="sm"
                $variant="ghost"
                href={link}
                startIcon={icon}
              >
                {title}
              </ButtonLink>
            </li>
          ))}

          <li>
            <Button
              $size="sm"
              $variant="ghost"
              startIcon={LogOut}
              style={{ justifyContent: 'normal' }}
              onClick={onSignOut}
            >
              {t('userMenu.nav.signOut')}
            </Button>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
};
