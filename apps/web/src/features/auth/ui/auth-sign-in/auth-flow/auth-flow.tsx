// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Countdown from 'react-countdown';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { z } from 'zod';

import { SignInWith } from '@/entities/auth/ui/sign-in-with';
import { AuthService } from '@/features/auth/lib/auth.service';
import { setAccessToken } from '@/features/auth/store/auth.slice';
import { APP } from '@/shared/constants';
import {
  ExpiredOTPError,
  UnauthorizedError,
  UnexpectedError,
} from '@/shared/errors/api-error';
import { useAppDispatch } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Heading, Input, InputOTP, Label, Text } from '@/shared/ui';
import { timeBuilder } from '@/shared/utils/time';

import {
  Form,
  FormGroup,
  FormWrapper,
  SeparatorText,
  SignInWithGroup,
  Wrapper,
} from './auth-flow.styled';

import type { FC } from 'react';
import type { CountdownRenderProps } from 'react-countdown';

export const AuthFlow = () => {
  const otpLength = 6;
  const otpResendTime: number = timeBuilder.seconds(59);
  const authService = new AuthService();

  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next');
  const dispatch = useAppDispatch();
  const [formPosition, setFormPosition] = useState('0');
  const [otpCountDown, setOTPCountDown] = useState<number>(0);
  const [verifiedMessage, setVerifiedMessage] = useState<string>('');
  const now = new Date().getTime();

  const formStepSlide = (slideTo: number) => {
    switch (slideTo) {
      case 1:
        setFormPosition('0');
        break;
      case 2:
        setFormPosition('-50%');
        break;
      default:
        setFormPosition('0');
        break;
    }
  };

  const signInSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: t('form.errors.required', {
          label: t('signIn.email.label'),
        }),
      })
      .email({
        message: t('form.errors.email'),
      }),
  });

  type SignInFormValues = z.infer<typeof signInSchema>;

  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const verifyEmailSchema = z.object({
    otp: z
      .string()
      .length(
        otpLength,
        t('verifyEmail.otpErrors.length', {
          length: otpLength,
        }),
      )
      .regex(/^[a-zA-Z0-9]*$/, t('verifyEmail.otpErrors.format'))
      .toUpperCase(),
  });

  type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

  const verifyEmailForm = useForm<VerifyEmailFormValues>({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(verifyEmailSchema),
  });

  const otpWatch = useWatch({ control: verifyEmailForm.control, name: 'otp' });

  const signInSubmit = async (data: SignInFormValues) => {
    try {
      await authService.userSignIn(data.email);

      setOTPCountDown(now + otpResendTime);
      formStepSlide(2);
    } catch (error: unknown) {
      if (error instanceof UnexpectedError) {
        signInForm.setError('email', {
          type: 'server',
          message: t('errors.network'),
        });
      } else {
        signInForm.setError('email', {
          type: 'unknown',
          message: t('errors.unknown'),
        });
      }
    }
  };

  const verifyEmailSubmit = async (data: VerifyEmailFormValues) => {
    try {
      const accessToken = await authService.userVerifyEmail(
        signInForm.getValues('email'),
        data.otp,
      );

      dispatch(setAccessToken(accessToken));
      setVerifiedMessage(t('verifyEmail.success'));
      router.replace(next ?? '/');
    } catch (error: unknown) {
      if (error instanceof ExpiredOTPError) {
        verifyEmailForm.setError('otp', {
          type: 'server',
          message: t('verifyEmail.otpErrors.expired'),
        });
      } else if (error instanceof UnauthorizedError) {
        verifyEmailForm.setError('otp', {
          type: 'server',
          message: t('verifyEmail.otpErrors.incorrect'),
        });
      } else if (error instanceof UnexpectedError) {
        verifyEmailForm.setError('otp', {
          type: 'server',
          message: t('errors.network'),
        });
      } else {
        verifyEmailForm.setError('otp', {
          type: 'unknown',
          message: t('errors.unknown'),
        });
      }
    }
  };

  const requestNewCode = async () => {
    try {
      await authService.userSignIn(signInForm.getValues('email'));

      setOTPCountDown(now + otpResendTime);
      verifyEmailForm.resetField('otp');
    } catch (error: unknown) {
      if (error instanceof UnexpectedError) {
        verifyEmailForm.setError('otp', {
          type: 'server',
          message: t('errors.network'),
        });
      } else {
        verifyEmailForm.setError('otp', {
          type: 'unknown',
          message: t('errors.unknown'),
        });
      }
    }
  };

  const backToSignIn = () => {
    signInForm.resetField('email');
    verifyEmailForm.resetField('otp');
    setVerifiedMessage('');
    formStepSlide(1);
  };

  const renderer: FC<CountdownRenderProps> = ({ seconds, completed }) => {
    if (completed) {
      return (
        <Button
          $color="blue"
          $size="sm"
          $variant="ghost"
          style={{ marginTop: '6px', width: '98%' }}
          onClick={requestNewCode}
        >
          {t('verifyEmail.resend.button')}
        </Button>
      );
    }

    return (
      <Text $align="center" $size="sm" style={{ marginTop: '8px' }}>
        {t('verifyEmail.resend.message')}&nbsp;
        {seconds}
        &nbsp;{t('units.time.seconds')}
      </Text>
    );
  };

  return (
    <Wrapper>
      <FormGroup
        animate={{ x: formPosition }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <FormWrapper>
          <Heading $size="xl" $weight="extrabold" as="h3">
            {t('signIn.title')}
          </Heading>
          <Text
            $color="description"
            $size="sm"
            as="p"
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            {t('signIn.description', { appName: APP.name })}
          </Text>
          <Form noValidate onSubmit={signInForm.handleSubmit(signInSubmit)}>
            <Label $size="sm" htmlFor="email">
              {t('signIn.email.label')}
            </Label>
            <Input
              {...signInForm.register('email')}
              $isError={Boolean(signInForm.formState.errors.email)}
              autoCapitalize="off"
              autoComplete="email"
              autoCorrect="off"
              errorMessage={signInForm.formState.errors.email?.message}
              id="email"
              maxLength={80}
              name="email"
              placeholder={t('signIn.email.placeholder')}
              spellCheck="false"
              type="email"
            />
            <Button $color="blue" style={{ marginTop: '6px' }} type="submit">
              {t('signIn.submit')}
            </Button>
          </Form>
          <SeparatorText>{t('signIn.alternatives')}</SeparatorText>
          <SignInWithGroup>
            <SignInWith provider="google" />
            <SignInWith provider="apple" />
            <SignInWith provider="facebook" />
          </SignInWithGroup>
        </FormWrapper>
        <FormWrapper>
          <Heading $size="xl" $weight="extrabold" as="h3">
            {t('verifyEmail.title')}
          </Heading>
          <Text
            $color="description"
            $size="sm"
            as="p"
            style={{ marginTop: '16px', marginBottom: '16px', maxWidth: '99%' }}
          >
            <Trans
              components={[<Text key="email_description" $weight="bold" />]}
              i18nKey="verifyEmail.description"
              t={t}
              values={{ email: signInForm.getValues('email') }}
            />
          </Text>
          <Form
            noValidate
            onSubmit={verifyEmailForm.handleSubmit(verifyEmailSubmit)}
          >
            <Controller
              control={verifyEmailForm.control}
              name="otp"
              render={({ field }) => {
                return (
                  <InputOTP
                    {...field}
                    $isError={Boolean(verifyEmailForm.formState.errors.otp)}
                    $isSuccess={verifiedMessage !== ''}
                    inputMode="text"
                    maxLength={otpLength}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    message={
                      verifyEmailForm.formState.errors.otp?.message ??
                      verifiedMessage
                    }
                    messageType={
                      verifyEmailForm.formState.errors.otp ? 'ERROR' : 'SUCCESS'
                    }
                  />
                );
              }}
            />
            <Button
              $color="blue"
              style={{ marginTop: '6px', width: '98%' }}
              type="submit"
              disabled={
                otpWatch.length !== otpLength ||
                verifyEmailForm.formState.isSubmitting
              }
            >
              {t('verifyEmail.submit')}
            </Button>
            <Countdown
              key={otpCountDown}
              date={otpCountDown}
              renderer={renderer}
            />
            <Button
              $color="blue"
              $size="sm"
              $variant="ghost"
              style={{ marginTop: '6px', width: '98%' }}
              onClick={backToSignIn}
            >
              {t('verifyEmail.back')}
            </Button>
          </Form>
        </FormWrapper>
      </FormGroup>
    </Wrapper>
  );
};
