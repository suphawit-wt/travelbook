// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { X } from 'lucide-react';

import { Button, Dialog, IconButton, Image } from '@/shared/ui';

import {
  ProfileAvatar,
  ProfileAvatarWrapper,
} from './mobile-user-profile-button.styled';
import { MobileUserProfileDialog } from './mobile-user-profile-dialog/mobile-user-profile-dialog';

import type { MobileUserProfileButtonProps } from './mobile-user-profile-button.types';
import type { FC } from 'react';

export const MobileUserProfileButton: FC<MobileUserProfileButtonProps> = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button $variant="ghost">
          <ProfileAvatarWrapper>
            <ProfileAvatar>
              <Image
                $shape="circle"
                alt="Profile Avatar"
                height="28"
                src="/assets/images/avatar/default.png"
                width="28"
              />
            </ProfileAvatar>
          </ProfileAvatarWrapper>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <MobileUserProfileDialog />
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
