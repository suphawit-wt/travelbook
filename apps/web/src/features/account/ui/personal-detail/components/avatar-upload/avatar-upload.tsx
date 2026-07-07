// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import { X } from 'lucide-react';
import { type FC, useRef, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

import { UserService } from '@/features/user/lib/user.service';
import { selectUserAvatar } from '@/features/user/store/user-preferences.selectors';
import { setAvatar } from '@/features/user/store/user-preferences.slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Dialog, IconButton, Image, Text } from '@/shared/ui';

import {
  AvatarWrapper,
  ProfileButton,
  ProfileImageDialogTitle,
  ProfileImageDialogWrapper,
  ProfileImageUploadWrapper,
} from './avatar-upload.styled';

import type { AvatarUploadProps } from './avatar-upload.types';

import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginFilePoster,
);

export const AvatarUpload: FC<AvatarUploadProps> = ({ disabled = false }) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = new UserService(axiosClient);
  const dispatch = useAppDispatch();
  const userAvatar = useAppSelector(selectUserAvatar);
  const filePondRef = useRef<FilePond | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadAvatar = async () => {
    if (filePondRef.current) {
      try {
        await filePondRef.current.processFile();
      } catch (err) {
        // eslint-disable-next-line no-console -- for debug
        console.error('FilePond processing error:', err);
      }
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ProfileButton disabled={disabled}>
          <AvatarWrapper>
            <Image alt="profile" height={60} src={userAvatar} width={60} />
          </AvatarWrapper>
        </ProfileButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <ProfileImageDialogWrapper>
            <ProfileImageDialogTitle>
              <Dialog.Title>
                {t('personalDetails.profileImage.title')}
              </Dialog.Title>
              <Dialog.Description>
                {t('personalDetails.profileImage.description')}
              </Dialog.Description>
              {uploadError ? (
                <Text $color="red" $size="sm" as="div">
                  {uploadError}
                </Text>
              ) : null}
              <Button $color="blue" $size="sm" onClick={handleUploadAvatar}>
                {t('actions.save', { ns: 'common' })}
              </Button>
            </ProfileImageDialogTitle>

            <div>
              <ProfileImageUploadWrapper>
                <FilePond
                  ref={filePondRef}
                  acceptedFileTypes={['image/png', 'image/jpeg']}
                  allowMultiple={false}
                  allowProcess={false}
                  allowRevert={false}
                  imageCropAspectRatio="1:1"
                  imagePreviewHeight={512}
                  imageResizeTargetHeight={512}
                  imageResizeTargetWidth={512}
                  instantUpload={false}
                  labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                  maxFileSize="2MB"
                  maxFiles={1}
                  name="avatar"
                  styleButtonProcessItemPosition="right bottom"
                  styleButtonRemoveItemPosition="center bottom"
                  styleLoadIndicatorPosition="right bottom"
                  stylePanelLayout="compact circle"
                  styleProgressIndicatorPosition="right bottom"
                  files={[
                    {
                      source: 'initial-avatar',
                      options: {
                        type: 'local',
                        metadata: {
                          poster: userAvatar,
                        },
                      },
                    },
                  ]}
                  onaddfile={(error) => {
                    if (error) {
                      // Handles front-end validation failures (e.g., file too large)
                      setUploadError(error.main as string);
                      return;
                    }

                    // File is valid and IDLE!
                    setUploadError(null);
                  }}
                  server={{
                    process: (
                      fieldName,
                      file,
                      _metadata,
                      load,
                      error,
                      progress,
                      abort,
                    ) => {
                      const formData = new FormData();
                      formData.append(fieldName, file, file.name);

                      const runUpload = async () => {
                        const formData = new FormData();
                        formData.append(fieldName, file, file.name);

                        try {
                          const avatarUrl = await userService.uploadAvatar(
                            formData,
                            (e) => {
                              progress(
                                e.lengthComputable,
                                e.loaded,
                                e.total ?? 0,
                              );
                            },
                          );

                          load(avatarUrl);
                          dispatch(setAvatar(avatarUrl));
                        } catch (err) {
                          error('Upload failed');
                          // eslint-disable-next-line no-console -- for debug
                          console.error(err);
                        }
                      };

                      void runUpload();

                      return {
                        abort: () => {
                          abort();
                        },
                      };
                    },
                  }}
                />
              </ProfileImageUploadWrapper>
            </div>

            <Dialog.Close asChild>
              <IconButton
                $size="sm"
                $variant="ghost"
                icon={X}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                }}
              />
            </Dialog.Close>
          </ProfileImageDialogWrapper>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
