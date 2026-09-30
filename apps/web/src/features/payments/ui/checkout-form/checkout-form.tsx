// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { LockKeyhole } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next';

import { APP } from '@/shared/constants/app';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Checkbox, Heading, Label, Link, Text } from '@/shared/ui';

import {
  ButtonGroup,
  Card,
  ConsentAndPrivacyGroup,
  FormActionGroup,
} from './checkout-form.styled';

import type { CheckoutFormProps } from './checkout-form.types';
import type { FC } from 'react';

export const CheckoutForm: FC<CheckoutFormProps> = ({ propertyName }) => {
  const { t } = useTranslation('booking');

  const params = useParams();
  const bookingId = params['slug'] as string;

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${APP.url}/booking/${bookingId}/confirmation`,
      },
    });

    // eslint-disable-next-line no-console -- for debug
    console.error(error.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <Heading
          $size="xl"
          $weight="bold"
          as="h2"
          style={{ marginBottom: '16px' }}
        >
          {t('payment.methods.title')}
        </Heading>

        <PaymentElement />
      </Card>

      <ConsentAndPrivacyGroup>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            marginBlock: '10px',
          }}
        >
          <div>
            <Checkbox id="accept_marketing_email" />
          </div>
          <Label $size="sm" htmlFor="accept_marketing_email">
            {t('payment.consents.marketing', { appName: APP.name })}
          </Label>
        </div>

        <div style={{ marginBlockEnd: '10px' }}>
          <Text $size="xs" as="p">
            <Trans
              i18nKey="payment.consents.privacy"
              t={t}
              values={{ appName: APP.name }}
              components={[
                // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                <Link
                  $enableHoverColor
                  $color="blue"
                  $underline="always"
                  href="privacy"
                />,
              ]}
            />
          </Text>
        </div>

        <div style={{ marginBlockEnd: '10px' }}>
          <Text $size="sm" as="p">
            <Trans
              i18nKey="payment.consents.terms"
              t={t}
              values={{ hotelName: propertyName }}
              components={[
                // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                <Link
                  $enableHoverColor
                  $color="blue"
                  $underline="always"
                  href="conditions"
                />,
                // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                <Link
                  $enableHoverColor
                  $color="blue"
                  $underline="always"
                  href="terms"
                />,
                // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                <Link
                  $enableHoverColor
                  $color="blue"
                  $underline="always"
                  href="privacy"
                />,
              ]}
            />
          </Text>
        </div>
      </ConsentAndPrivacyGroup>
      <FormActionGroup>
        <ButtonGroup>
          {/* Submit Button */}
          <Button
            $color="blue"
            $size="md"
            startIcon={LockKeyhole}
            style={{ padding: '14px 26px' }}
            type="submit"
          >
            {t('payment.cta')}
          </Button>
        </ButtonGroup>
      </FormActionGroup>
    </form>
  );
};
