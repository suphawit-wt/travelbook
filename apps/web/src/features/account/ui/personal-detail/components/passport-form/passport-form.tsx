// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import { UserService } from '@/features/user/lib/user.service';
import type { PassportDetailsRequest } from '@/features/user/lib/user.service.types';
import { APP } from '@/shared/constants';
import { countries } from '@/shared/data/countries';
import { UnauthorizedError, UnexpectedError } from '@/shared/errors/api-error';
import { axiosClient } from '@/shared/lib/axios-client';
import type { Language } from '@/shared/types/store';
import {
  Button,
  Checkbox,
  DatePicker,
  Icon,
  Input,
  Label,
  Link,
  Select,
  Text,
} from '@/shared/ui';
import { formatLocalizedDate } from '@/shared/utils/date';

import {
  AccountInputForm,
  AccountInputItemGroup,
  AccountInputLabelAndInfo,
  InputGroup,
  InputGroupWrapper,
  SaveButtonWrapper,
} from '../../personal-detail.styled';

import type { PassportFormProps } from './passport-form.types';
import type { CheckedState } from '@radix-ui/react-checkbox';

export const PassportForm: FC<PassportFormProps> = ({
  passportDetails,
  editActive,
  setEditActive,
}) => {
  const { t, i18n } = useTranslation(['account', 'country', 'common']);
  const currentLanguage = i18n.resolvedLanguage ?? 'en';
  const userService = useMemo(() => new UserService(axiosClient), []);
  const isEditing = editActive === 'passport';
  const today = new Date();

  const updatePassportDetailsSchema = z.object({
    firstName: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('personalDetails.name.firstName'),
          ns: 'common',
        }),
      })
      .nullable(),
    lastName: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('personalDetails.name.lastName'),
          ns: 'common',
        }),
      })
      .nullable(),
    passportNumber: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('personalDetails.passport.number.label'),
          ns: 'common',
        }),
      })
      .nullable(),
    issueCountry: z
      .string()
      .min(1, {
        message: 'Issue Country is required.',
      })
      .nullable(),
    expireDate: z.date().nullable(),
    consentPassport: z.boolean().refine((val) => val, {
      message: t('form.errors.consent', { ns: 'common' }),
    }),
  });

  type PassportFormValues = z.infer<typeof updatePassportDetailsSchema>;

  const {
    control,
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PassportFormValues>({
    resolver: zodResolver(updatePassportDetailsSchema),
    values: {
      firstName: passportDetails?.firstName ?? '',
      lastName: passportDetails?.lastName ?? '',
      passportNumber: passportDetails?.passportNumber ?? '',
      issueCountry: passportDetails?.issueCountry ?? '',
      expireDate: passportDetails?.expireDate,
      consentPassport: false,
    },
  });

  const onSubmit = async (data: PassportFormValues) => {
    try {
      const localExpireDate = format(data.expireDate, 'yyyy-MM-dd');
      const req: PassportDetailsRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        passportNumber: data.passportNumber,
        issueCountry: data.issueCountry,
        expireDate: localExpireDate,
      };

      await userService.updatePassportDetails(req);
      setEditActive('none');
    } catch (error) {
      const targetField = 'consentPassport';
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

  const deletePassportDetails = async () => {
    try {
      await userService.deletePassportDetails();

      setValue('firstName', null);
      setValue('lastName', null);
      setValue('passportNumber', null);
      setValue('issueCountry', null);
      setValue('expireDate', null);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console -- for debug
      console.error(error);
    }
  };

  const onConsentChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') {
      return;
    }

    setValue('consentPassport', Boolean(checked));
  };

  return (
    <AccountInputForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <AccountInputItemGroup>
        <AccountInputLabelAndInfo>
          <Text>{t('personalDetails.passport.title')}</Text>
          {isEditing ? (
            <div>
              <Text $size="sm" as="div">
                {t('personalDetails.passport.description')}
              </Text>
              <InputGroupWrapper style={{ marginTop: '16px' }}>
                <InputGroup>
                  <Label $size="sm" htmlFor="firstName">
                    {t('personalDetails.name.firstName')}&nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Input
                    {...register('firstName')}
                    $isError={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                    id="firstName"
                    maxLength={80}
                    type="text"
                  />
                </InputGroup>
                <InputGroup>
                  <Label $size="sm" htmlFor="lastName">
                    {t('personalDetails.name.lastName')} &nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Input
                    {...register('lastName')}
                    $isError={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                    id="lastName"
                    maxLength={80}
                    type="text"
                  />
                </InputGroup>
              </InputGroupWrapper>
              <Text $color="description" $size="xs" as="div">
                {t('personalDetails.passport.nameHint')}
              </Text>
              <InputGroupWrapper style={{ marginTop: '16px' }}>
                <InputGroup>
                  <Label $size="sm" htmlFor="issueCountry">
                    {t('personalDetails.passport.issuingCountry.label')}&nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Select.Wrapper>
                    <Select.Root
                      {...register('issueCountry')}
                      $isError={Boolean(errors.issueCountry)}
                      errorMessage={errors.issueCountry?.message}
                      id="issueCountry"
                    >
                      <Select.Option disabled selected value="">
                        {t(
                          'personalDetails.passport.issuingCountry.placeholder',
                        )}
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
                  <Label $size="sm" htmlFor="passportNumber">
                    {t('personalDetails.passport.number.label')}&nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Input
                    {...register('passportNumber')}
                    $isError={Boolean(errors.passportNumber)}
                    errorMessage={errors.passportNumber?.message}
                    id="passportNumber"
                    maxLength={80}
                    type="text"
                    placeholder={t(
                      'personalDetails.passport.number.placeholder',
                    )}
                  />
                </InputGroup>
              </InputGroupWrapper>

              <InputGroupWrapper style={{ marginTop: '16px' }}>
                <InputGroup>
                  <Label $size="sm" htmlFor="expireDate">
                    {t('personalDetails.passport.expiry.label')}&nbsp;
                    <Text $color="red" $size="xs">
                      *
                    </Text>
                  </Label>
                  <Controller
                    control={control}
                    name="expireDate"
                    render={({ field }) => (
                      <DatePicker
                        minDate={today}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </InputGroup>
                <InputGroup />
              </InputGroupWrapper>
              <Text $color="description" $size="xs" as="div">
                {t('personalDetails.passport.expiry.hint')}
              </Text>

              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <div>
                  <Checkbox
                    {...register('consentPassport')}
                    aria-label="consent passport"
                    id="consent_passport"
                    onCheckedChange={onConsentChange}
                  />
                </div>
                <Label $size="sm" htmlFor="consent_passport">
                  <Trans
                    i18nKey="personalDetails.passport.consent"
                    t={t}
                    values={{ appName: APP.name }}
                    components={[
                      // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                      <Link
                        $color="blue"
                        $size="sm"
                        $underline="hover"
                        href="privacy"
                      />,
                    ]}
                  />
                </Label>
              </div>
              {errors.consentPassport ? (
                <Text
                  $color="red"
                  $size="sm"
                  as="div"
                  style={{ marginTop: '8px' }}
                >
                  {errors.consentPassport.message}
                </Text>
              ) : null}
            </div>
          ) : (
            <div>
              {getValues('passportNumber') && getValues('expireDate') ? (
                <>
                  <Text $size="sm" as="div">
                    Passport: .........{getValues('passportNumber').slice(-2)}
                  </Text>
                  <Text $size="xs" as="div">
                    Expiration date:{' '}
                    {formatLocalizedDate(
                      getValues('expireDate'),
                      currentLanguage as Language,
                      'numeric',
                    )}
                  </Text>
                </>
              ) : (
                <Text $color="description" $size="sm">
                  {t('personalDetails.passport.placeholder')}
                </Text>
              )}
            </div>
          )}
        </AccountInputLabelAndInfo>
        {
          // eslint-disable-next-line no-nested-ternary -- for render button ui
          getValues('passportNumber') &&
          getValues('expireDate') &&
          getValues('issueCountry') &&
          getValues('firstName') &&
          getValues('lastName') ? (
            <Button
              $color="blue"
              $size="sm"
              $variant="ghost"
              disabled={editActive !== 'none'}
              type="button"
              onClick={deletePassportDetails}
            >
              {t('actions.delete', { ns: 'common' })}
            </Button>
          ) : editActive === 'passport' ? (
            <Button
              $color="blue"
              $size="sm"
              $variant="ghost"
              onClick={() => setEditActive('none')}
            >
              {t('actions.cancel', { ns: 'common' })}
            </Button>
          ) : (
            <Button
              $color="blue"
              $size="sm"
              $variant="ghost"
              disabled={editActive !== 'none'}
              onClick={() => setEditActive('passport')}
            >
              {t('personalDetails.passport.add')}
            </Button>
          )
        }
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
