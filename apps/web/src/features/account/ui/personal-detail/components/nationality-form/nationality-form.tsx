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
import { countries } from '@/shared/data/countries';
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

import type { NationalityFormProps } from './nationality-form.types';

export const NationalityForm: FC<NationalityFormProps> = ({
  nationality,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'country', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'nationality';

  const updateNationalitySchema = z.object({
    nationality: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.nationality.label'),
      }),
    }),
  });

  type NationalityFormValues = z.infer<typeof updateNationalitySchema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<NationalityFormValues>({
    resolver: zodResolver(updateNationalitySchema),
    values: {
      nationality: nationality ?? '',
    },
  });

  const onSubmit = async (data: NationalityFormValues) => {
    try {
      await userService.updateNationality(data.nationality);
      setEditActive('none');
    } catch (error) {
      const targetField = 'nationality';
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
          <Text>{t('personalDetails.nationality.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="display_name">
                  {t('personalDetails.nationality.label')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Select.Wrapper>
                  <Select.Root
                    {...register('nationality')}
                    $isError={Boolean(errors.nationality)}
                    errorMessage={errors.nationality?.message}
                    id="nationality"
                  >
                    <Select.Option disabled selected value="">
                      {t('personalDetails.nationality.placeholder')}
                    </Select.Option>
                    {countries.map((country) => (
                      <Select.Option key={country.code} value={country.code}>
                        {t(country.code, { ns: 'country' })}
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
              {getValues('nationality') ? (
                <Text $size="sm">
                  {t(getValues('nationality'), { ns: 'country' })}
                </Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.nationality.placeholder')}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'nationality')}
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
