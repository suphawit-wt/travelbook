// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Bell,
  CreditCard,
  LockKeyhole,
  Settings2,
  UserRound,
  UserSquare,
  UsersRound,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { type FC, useEffect, useMemo, useState } from 'react';

import { UserService } from '@/features/user/lib/user.service';
import { type UserInfoResponse } from '@/features/user/lib/user.service.types';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import { Heading, Icon, Link, Text } from '@/shared/ui';

import { AddressForm } from './components/address-form';
import { AvatarUpload } from './components/avatar-upload';
import { DateOfBirthForm } from './components/date-of-birth-form';
import { DisplayNameForm } from './components/display-name-form';
import { EmailForm } from './components/email-form';
import { GenderForm } from './components/gender-form';
import { NameForm } from './components/name-form';
import { NationalityForm } from './components/nationality-form';
import { PassportForm } from './components/passport-form';
import { PhoneForm } from './components/phone-form';
import {
  AccountInputList,
  AccountMenuItem,
  AccountMenuList,
  IconDisplay,
  Main,
  Sidebar,
  TitleProfile,
  Wrapper,
} from './personal-detail.styled';

import type { EditMode, MenuItem } from './personal-detail.types';

export const PersonalDetail: FC = () => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const [editActive, setEditActive] = useState<EditMode>('none');
  const [user, setUser] = useState<UserInfoResponse | null>(null);

  const pathname = usePathname();
  const currentSlug = pathname.split('/')[3];

  const accountMenuItems: MenuItem[] = [
    {
      id: 'personal-details',
      href: 'account/personal-details',
      icon: UserRound,
      title: t('personalDetails.title'),
      isActive: currentSlug === 'personal-details',
    },
    {
      id: 'customize-preferences',
      href: 'account/customize-preferences',
      icon: Settings2,
      title: t('preferences.title'),
      isActive: currentSlug === 'customize-preferences',
    },
    {
      id: 'security-settings',
      href: 'account/security-settings',
      icon: LockKeyhole,
      title: t('security.title'),
      isActive: currentSlug === 'security-settings',
    },
    {
      id: 'payment-methods',
      href: 'account/payment-methods',
      icon: CreditCard,
      title: t('payments.title'),
      isActive: currentSlug === 'payment-methods',
    },
    {
      id: 'privacy-data-management',
      href: 'account/privacy-data-management',
      icon: UserSquare,
      title: t('privacy.title'),
      isActive: currentSlug === 'privacy-data-management',
    },
    {
      id: 'email-preferences',
      href: 'account/email-preferences',
      icon: Bell,
      title: t('notifications.title'),
      isActive: currentSlug === 'email-preferences',
    },
    {
      id: 'other-travelers',
      href: 'account/other-travelers',
      icon: UsersRound,
      title: t('travelers.title'),
      isActive: currentSlug === 'other-travelers',
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserInfo();
        setUser(data);
      } catch (error) {
        // eslint-disable-next-line no-console -- for debug
        console.error('Failed to fetch user info:', error);
      }
    };

    void fetchUser();
  }, [userService, setUser]);

  return (
    <Wrapper>
      <Sidebar>
        <AccountMenuList>
          {accountMenuItems.map((menu) => (
            <li key={menu.id}>
              <Link href={menu.href}>
                <AccountMenuItem $isActive={menu.isActive}>
                  <IconDisplay>
                    <Icon $size="sm" icon={menu.icon} />
                  </IconDisplay>
                  <Text $size="sm">{menu.title}</Text>
                </AccountMenuItem>
              </Link>
            </li>
          ))}
        </AccountMenuList>
      </Sidebar>

      <Main>
        <TitleProfile>
          <div style={{ marginBottom: '20px' }}>
            <Heading
              $size="3xl"
              $weight="bold"
              as="h1"
              style={{ marginBlockEnd: '10px' }}
            >
              {t('personalDetails.title')}
            </Heading>
            <Text $color="description">{t('personalDetails.description')}</Text>
          </div>
          <AvatarUpload disabled={editActive !== 'none'} />
        </TitleProfile>

        <AccountInputList>
          <NameForm
            editActive={editActive}
            firstName={user?.firstName}
            lastName={user?.lastName}
            setEditActive={setEditActive}
          />
          <DisplayNameForm
            displayName={user?.displayName}
            editActive={editActive}
            setEditActive={setEditActive}
          />
          <EmailForm
            editActive={editActive}
            email={user?.email}
            setEditActive={setEditActive}
          />
          <PhoneForm
            editActive={editActive}
            phoneNumber={user?.phoneNumber}
            setEditActive={setEditActive}
          />
          <DateOfBirthForm
            dateOfBirth={user?.personalDetails.dateOfBirth}
            editActive={editActive}
            setEditActive={setEditActive}
          />
          <NationalityForm
            editActive={editActive}
            nationality={user?.personalDetails.nationality}
            setEditActive={setEditActive}
          />
          <GenderForm
            editActive={editActive}
            gender={user?.personalDetails.gender}
            setEditActive={setEditActive}
          />
          <AddressForm
            address={user?.address}
            editActive={editActive}
            setEditActive={setEditActive}
          />
          <PassportForm
            editActive={editActive}
            passportDetails={user?.passportDetails}
            setEditActive={setEditActive}
          />
        </AccountInputList>
      </Main>
    </Wrapper>
  );
};
