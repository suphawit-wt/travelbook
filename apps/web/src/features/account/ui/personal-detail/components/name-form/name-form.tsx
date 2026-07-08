// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
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

import type { NameFormProps } from './name-form.types';

export const NameForm: FC<NameFormProps> = ({
  firstName,
  lastName,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'name';

  const updateNameSchema = z.object({
    firstName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.name.firstName'),
      }),
    }),
    lastName: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.name.lastName'),
      }),
    }),
  });

  type NameFormValues = z.infer<typeof updateNameSchema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<NameFormValues>({
    resolver: zodResolver(updateNameSchema),
    values: {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
    },
  });

  const onSubmit = async (data: NameFormValues) => {
    try {
      await userService.updateName(data);
      setEditActive('none');
    } catch (error) {
      const targetField = 'firstName';
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
          <Text>{t('personalDetails.name.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="firstName">
                  {t('personalDetails.name.firstName')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Input
                  {...register('firstName')}
                  $isError={Boolean(errors.firstName)}
                  errorMessage={errors.firstName?.message}
                  maxLength={80}
                />
              </InputGroup>
              <InputGroup>
                <Label $size="sm" htmlFor="lastName">
                  {t('personalDetails.name.lastName')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Input
                  {...register('lastName')}
                  $isError={Boolean(errors.lastName)}
                  errorMessage={errors.lastName?.message}
                  maxLength={80}
                />
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {getValues('firstName') && getValues('lastName') ? (
                <Text $size="sm">{`${getValues('firstName')} ${getValues('lastName')}`}</Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.name.placeholder')}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'name')}
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
