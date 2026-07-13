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
import { type AddressRequest } from '@/features/user/lib/user.service.types';
import { countries } from '@/shared/data/countries';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import { Button, Icon, Input, Label, Select, Text } from '@/shared/ui';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { AddressFormProps } from './address-form.types';

export const AddressForm: FC<AddressFormProps> = ({
  address,
  editActive,
  setEditActive,
}) => {
  const { t } = useTranslation(['account', 'country', 'common']);
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'address';

  const updateAddressSchema = z.object({
    countryCode: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.address.country.label'),
      }),
    }),
    addressLine1: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.address.street.label'),
      }),
    }),
    city: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.address.city.label'),
        interpolation: { escapeValue: false },
      }),
    }),
    zipCode: z.string().min(1, {
      message: t('form.errors.required', {
        label: t('personalDetails.address.zip.label'),
      }),
    }),
  });

  type AddressFormValues = z.infer<typeof updateAddressSchema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(updateAddressSchema),
    values: {
      countryCode: address?.countryCode ?? '',
      addressLine1: address?.addressLine1 ?? '',
      city: address?.city ?? '',
      zipCode: address?.zipCode ?? '',
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      const req: AddressRequest = {
        countryCode: data.countryCode,
        addressLine1: data.addressLine1,
        city: data.city,
        zipCode: data.zipCode,
      };

      await userService.updateAddress(req);
      setEditActive('none');
    } catch (error) {
      const targetField = 'addressLine1';
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
          <Text>{t('personalDetails.address.title')}</Text>
          {isEditing ? (
            <InputGroupWrapper style={{ flexDirection: 'column' }}>
              <InputGroup>
                <Label $size="sm" htmlFor="countryCode">
                  {t('personalDetails.address.country.label')}
                  &nbsp;
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Select.Wrapper>
                  <Select.Root
                    {...register('countryCode')}
                    $isError={Boolean(errors.countryCode)}
                    errorMessage={errors.countryCode?.message}
                    id="country"
                  >
                    <Select.Option disabled selected value="">
                      {t('personalDetails.address.country.placeholder')}
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
              <InputGroup>
                <Label $size="sm" htmlFor="addressLine1">
                  {t('personalDetails.address.street.label')}
                  &nbsp;
                  <Text $color="red" $size="xs">
                    *
                  </Text>
                </Label>
                <Input
                  {...register('addressLine1')}
                  $isError={Boolean(errors.addressLine1)}
                  errorMessage={errors.addressLine1?.message}
                  id="addressLine1"
                  placeholder={t('personalDetails.address.street.placeholder')}
                />
              </InputGroup>
              <div style={{ display: 'flex', gap: '16px' }}>
                <InputGroup>
                  <Label $size="sm" htmlFor="city">
                    {t('personalDetails.address.city.label')}
                    &nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Input
                    {...register('city')}
                    $isError={Boolean(errors.city)}
                    errorMessage={errors.city?.message}
                    id="city"
                  />
                </InputGroup>
                <InputGroup>
                  <Label $size="sm" htmlFor="zipCode">
                    {t('personalDetails.address.zip.label')}
                    &nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Input
                    {...register('zipCode')}
                    $isError={Boolean(errors.zipCode)}
                    errorMessage={errors.zipCode?.message}
                    id="zipCode"
                  />
                </InputGroup>
              </div>
            </InputGroupWrapper>
          ) : (
            <div>
              {getValues('addressLine1') ? (
                <>
                  <Text $size="sm" as="div">
                    {getValues('addressLine1')}
                  </Text>
                  <Text $size="sm" as="div">
                    {getValues('zipCode')}&nbsp;{getValues('city')}
                  </Text>
                  <Text $size="sm" as="div">
                    {t(getValues('countryCode'), { ns: 'country' })}
                  </Text>
                </>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.address.placeholder')}
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
          onClick={() => setEditActive(isEditing ? 'none' : 'address')}
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
