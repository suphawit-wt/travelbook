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
import { Badge, Button, Input, Label, Text } from '@/shared/ui';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { EmailFormProps } from './email-form.types';

export const EmailForm: FC<EmailFormProps> = ({
  email,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'email';

  const updateEmailSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('personalDetails.email.label'),
        }),
      })
      .email({
        message: t('form.errors.email'),
      }),
  });

  type EmailFormValues = z.infer<typeof updateEmailSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    values: {
      email,
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    try {
      await userService.sendNewEmailVerification(data.email);
      setEditActive('none');
    } catch (error) {
      const targetField = 'email';
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
          <Text>{t('personalDetails.email.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="email">
                  {t('personalDetails.email.label')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Input
                  {...register('email')}
                  $isError={Boolean(errors.email)}
                  errorMessage={errors.email?.message}
                  maxLength={80}
                  type="email"
                />
                <Text
                  $color="description"
                  $size="sm"
                  as="p"
                  style={{ marginBlockStart: '10px' }}
                >
                  {t('personalDetails.email.hint')}
                </Text>
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {email ? (
                <Text $size="sm">
                  {email}&nbsp;
                  <Badge
                    $color="green"
                    $size="xs"
                    style={{ marginInlineStart: '4px' }}
                  >
                    {t('status.verified')}
                  </Badge>
                </Text>
              ) : null}
              <Text
                $color="description"
                $size="sm"
                as="p"
                style={{ marginBlockStart: '10px' }}
              >
                {t('personalDetails.email.description')}
              </Text>
            </div>
          )}
        </AccountInputLabelAndInfo>
        <Button
          $color="blue"
          $size="sm"
          $variant="ghost"
          disabled={editActive !== 'none' && !isEditing}
          type="button"
          onClick={() => setEditActive(isEditing ? 'none' : 'email')}
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
