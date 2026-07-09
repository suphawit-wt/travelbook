// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PhoneInput, {
  type Country,
  formatPhoneNumberIntl,
  parsePhoneNumber,
} from 'react-phone-number-input/input';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import { phoneCountryOptions } from '@/shared/data/phone-countries';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Icon, Label, Text } from '@/shared/ui';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import {
  PhoneCountryCodeLabel,
  PhoneCountryCodeSelect,
  PhoneInputWrapper,
  PhoneNumberInputGroup,
  PhoneNumberSelectGroup,
} from './phone-form.styled';

import type { PhoneFormProps } from './phone-form.types';

export const PhoneForm: FC<PhoneFormProps> = ({
  phoneNumber,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'phone';
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber ?? '');

  const updatePhoneSchema = z.object({
    phoneCountry: z.string(),
    phoneNumber: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.phone.label', { ns: 'account' }),
        ns: 'common',
      }),
    }),
  });

  type PhoneFormValues = z.infer<typeof updatePhoneSchema>;

  const {
    control,
    register,
    handleSubmit,
    setError,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(updatePhoneSchema),
    values: {
      phoneCountry: parsedPhoneNumber?.country ?? 'TH',
      phoneNumber: phoneNumber ?? '',
    },
  });

  const selectedCountry = watch('phoneCountry');
  const currentCountryLabel = useMemo(() => {
    const found = phoneCountryOptions.find(
      (opt) => opt.value === selectedCountry.toLowerCase(),
    );
    return found ? found.shortLabel : 'TH +66';
  }, [selectedCountry]);

  const onSubmit = async (data: PhoneFormValues) => {
    try {
      await userService.updatePhoneNumber(data.phoneNumber);
      setEditActive('none');
    } catch (error) {
      const targetField = 'phoneNumber';
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
          <Text>{t('personalDetails.phone.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper>
              <InputGroup>
                <Label $size="sm" htmlFor="phoneNumber">
                  {t('personalDetails.phone.label')}&nbsp;
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'initial',
                    alignItems: 'stretch',
                    flexDirection: 'column',
                  }}
                >
                  <PhoneNumberInputGroup>
                    <div style={{ flexShrink: '0' }}>
                      <PhoneNumberSelectGroup>
                        <PhoneCountryCodeSelect
                          required
                          id="phoneCountry"
                          {...register('phoneCountry')}
                        >
                          {phoneCountryOptions.map((phoneCountry) => (
                            <option
                              key={phoneCountry.value}
                              value={phoneCountry.value}
                              selected={
                                selectedCountry.toLowerCase() ===
                                phoneCountry.value
                              }
                            >
                              {phoneCountry.label}
                            </option>
                          ))}
                        </PhoneCountryCodeSelect>
                        <PhoneCountryCodeLabel>
                          {currentCountryLabel}
                        </PhoneCountryCodeLabel>
                        <span>
                          <Icon icon={ChevronDown} />
                        </span>
                      </PhoneNumberSelectGroup>
                    </div>
                    <PhoneInputWrapper>
                      <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <PhoneInput
                            country={selectedCountry.toUpperCase() as Country}
                            id="phoneNumber"
                            maxLength={80}
                            name={field.name}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    </PhoneInputWrapper>
                  </PhoneNumberInputGroup>
                  {errors.phoneNumber ? (
                    <Text
                      $color="red"
                      $size="sm"
                      as="div"
                      style={{ marginTop: '4px' }}
                    >
                      {errors.phoneNumber.message}
                    </Text>
                  ) : null}
                </div>
              </InputGroup>
            </InputGroupWrapper>
          ) : (
            <div>
              {getValues('phoneNumber') ? (
                <Text $size="sm">
                  {formatPhoneNumberIntl(getValues('phoneNumber'))}
                </Text>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.phone.placeholder')}
                </Text>
              )}
              <Text
                $color="description"
                $size="sm"
                as="p"
                style={{ marginBlockStart: '10px' }}
              >
                {t('personalDetails.phone.description')}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'phone')}
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
