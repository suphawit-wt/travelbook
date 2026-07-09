// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { type FC, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import { type Language } from '@/shared/types/store';
import { Button, DatePicker, Label, Text } from '@/shared/ui';
import { formatLocalizedDate } from '@/shared/utils/date';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { DateOfBirthFormProps } from './date-of-birth-form.types';

export const DateOfBirthForm: FC<DateOfBirthFormProps> = ({
  dateOfBirth,
  editActive,
  setEditActive,
}) => {
  const { t, i18n } = useTranslation(['account', 'common']);
  const currentLanguage = i18n.resolvedLanguage ?? 'en';
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'dob';
  const today = new Date();

  const updateDateOfBirthSchema = z.object({
    dateOfBirth: z.date().nullable(),
  });

  type DateOfBirthFormValues = z.infer<typeof updateDateOfBirthSchema>;

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<DateOfBirthFormValues>({
    resolver: zodResolver(updateDateOfBirthSchema),
    values: {
      dateOfBirth,
    },
  });

  const onSubmit = async (data: DateOfBirthFormValues) => {
    try {
      const localDate = format(data.dateOfBirth, 'yyyy-MM-dd');

      await userService.updateDateOfBirth(localDate);
      setEditActive('none');
    } catch (error) {
      const targetField = 'dateOfBirth';
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

  const currentDateOfBirth = getValues('dateOfBirth');

  return (
    <AccountInputForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <AccountInputItemGroup>
        <AccountInputLabelAndInfo>
          <Text>{t('personalDetails.dob.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="dob">
                  {t('personalDetails.dob.label')}{' '}
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <DatePicker
                      maxDate={today}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
                {errors.dateOfBirth ? (
                  <Text
                    $color="red"
                    $size="sm"
                    as="div"
                    style={{ marginTop: '4px' }}
                  >
                    {errors.dateOfBirth.message}
                  </Text>
                ) : null}
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {currentDateOfBirth ? (
                <Text $size="sm">
                  {formatLocalizedDate(
                    currentDateOfBirth,
                    currentLanguage as Language,
                    'numeric',
                  )}
                </Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.dob.placeholder', { ns: 'account' })}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'dob')}
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
