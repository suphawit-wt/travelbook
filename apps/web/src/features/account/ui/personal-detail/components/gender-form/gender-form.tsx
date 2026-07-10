// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import { genders } from '@/shared/data/gender';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Icon, Label, Select, Text } from '@/shared/ui';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { GenderFormProps } from './gender-form.types';

export const GenderForm: FC<GenderFormProps> = ({
  gender,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'gender';

  const updateGenderSchema = z.object({
    gender: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.gender.label'),
        ns: 'common',
      }),
    }),
  });

  type GenderFormValues = z.infer<typeof updateGenderSchema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<GenderFormValues>({
    resolver: zodResolver(updateGenderSchema),
    values: {
      gender: gender ?? '',
    },
  });

  const onSubmit = async (data: GenderFormValues) => {
    try {
      await userService.updateGender(data.gender);
      setEditActive('none');
    } catch (error) {
      const targetField = 'gender';
      if (error instanceof UnauthorizedError) {
        setError(targetField, { type: 'server', message: 'Unauthorized' });
      } else if (error instanceof UnexpectedError) {
        setError(targetField, {
          type: 'server',
          message: t('errors.network', { ns: 'common' }),
        });
      } else {
        setError(targetField, {
          type: 'unknown',
          message: t('errors.unknown', { ns: 'common' }),
        });
      }
    }
  };

  return (
    <AccountInputForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <AccountInputItemGroup>
        <AccountInputLabelAndInfo>
          <Text>{t('personalDetails.gender.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="gender">
                  {t('personalDetails.gender.label')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Select.Wrapper>
                  <Select.Root
                    {...register('gender')}
                    $isError={Boolean(errors.gender)}
                    errorMessage={errors.gender?.message}
                    id="gender"
                  >
                    <Select.Option disabled value="">
                      {t('personalDetails.gender.placeholder')}
                    </Select.Option>
                    {genders.map((gender) => (
                      <Select.Option key={gender.key} value={gender.key}>
                        {t(gender.label)}
                      </Select.Option>
                    ))}
                  </Select.Root>
                  <span>
                    <Icon icon={ChevronDown} />
                  </span>
                </Select.Wrapper>
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {getValues('gender') ? (
                <Text $size="sm">
                  {t(`personalDetails.gender.${getValues('gender')}`)}
                </Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.gender.placeholder')}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'gender')}
        >
          {isEditing
            ? t('actions.cancel', { ns: 'common' })
            : t('actions.edit', { ns: 'common' })}
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
