// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Input, Label, Text } from '@/shared/ui';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { DisplayNameFormProps } from './display-name-form.types';

export const DisplayNameForm: FC<DisplayNameFormProps> = ({
  displayName,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'display_name';

  const updateDisplayNameSchema = z.object({
    displayName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.displayName.label'),
      }),
    }),
  });

  type DisplayNameFormValues = z.infer<typeof updateDisplayNameSchema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<DisplayNameFormValues>({
    resolver: zodResolver(updateDisplayNameSchema),
    values: {
      displayName: displayName ?? '',
    },
  });

  const onSubmit = async (data: DisplayNameFormValues) => {
    try {
      await userService.updateDisplayName(data.displayName);
      setEditActive('none');
    } catch (error) {
      const targetField = 'displayName';
      if (error instanceof UnauthorizedError) {
        setError(targetField, { type: 'server', message: 'Unauthorized' });
      } else if (error instanceof UnexpectedError) {
        setError(targetField, { type: 'server', message: t('errors.network') });
      } else {
        setError(targetField, {
          type: 'unknown',
          message: t('errors.unknown'),
        });
      }
    }
  };

  return (
    <AccountInputForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <AccountInputItemGroup>
        <AccountInputLabelAndInfo>
          <Text>{t('personalDetails.displayName.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="display_name">
                  {t('personalDetails.displayName.label')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Input
                  {...register('displayName')}
                  $isError={Boolean(errors.displayName)}
                  errorMessage={errors.displayName?.message}
                  maxLength={80}
                />
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {getValues('displayName') ? (
                <Text $size="sm">{getValues('displayName')}</Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.displayName.placeholder')}
                </Text>
              )}
            </div>
          )}
        </AccountInputLabelAndInfo>
        <Button
          $color="blue"
          $size="sm"
          $variant="ghost"
          disabled={editActive !== 'none' && !isEditing}
          type="button"
          onClick={() => setEditActive(isEditing ? 'none' : 'display_name')}
        >
          {isEditing ? t('actions.cancel') : t('actions.edit')}
        </Button>
      </AccountInputItemGroup>
      {isEditing ? (
        <SaveButtonWrapper>
          <Button $color="blue" $size="sm" type="submit">
            {t('actions.save', { ns: 'common' })}
          </Button>
        </SaveButtonWrapper>
      ) : null}
    </AccountInputForm>
  );
};
