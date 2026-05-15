// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Menu, X } from 'lucide-react';

import { APP } from '@/shared/constants/app';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Dialog, IconButton } from '@/shared/ui';

import { NavDialog } from './nav-dialog/nav-dialog';

import type { MobileNavProps } from './mobile-nav.types';
import type { FC } from 'react';

export const MobileNav: FC<MobileNavProps> = (props) => {
  const { t } = useTranslation('common');

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton $variant="ghost" icon={Menu} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>{APP.name}</Dialog.Title>
          <Dialog.Description>{t('mobile.nav')}</Dialog.Description>
          {props.variant === 'auth' ? (
            <NavDialog variant="auth" />
          ) : (
            <NavDialog />
          )}
          <Dialog.Close asChild>
            <IconButton
              $variant="ghost"
              icon={X}
              style={{ position: 'absolute', top: '15px', right: '15px' }}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
