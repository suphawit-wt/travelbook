// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Check, X } from 'lucide-react';
import { Trans } from 'react-i18next';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import type { Language } from '@/shared/types/store';
import { Button, Dialog, Icon, IconButton, Text } from '@/shared/ui';
import { formatLocalizedDateString } from '@/shared/utils/date';

import { BookingConditionWrapper } from './my-booking-conditions.styled';

import type { MyBookingConditionsProps } from './my-booking-conditions.types';
import type { FC } from 'react';

export const MyBookingConditions: FC<MyBookingConditionsProps> = ({
  freeCancelDate,
  rooms,
}) => {
  const { t, i18n } = useTranslation('booking');

  const currentLanguage = i18n.resolvedLanguage ?? 'en';

  const timezone = 'Asia/Bangkok';
  const vat = 7;

  const freeCancelShortDate = formatLocalizedDateString(
    freeCancelDate ?? '2026-01-01',
    currentLanguage as Language,
    'short',
  );

  return (
    <div style={{ padding: '16px' }}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button $color="blue" $size="sm" $variant="ghost">
            {t('policies.cta')}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <BookingConditionWrapper>
              <Dialog.Title>{t('policies.title')}</Dialog.Title>
              {rooms?.map((room) => (
                <Text
                  key={`${room.name}-${room.quantity}`}
                  $size="xl"
                  as="div"
                  style={{ marginTop: '16px' }}
                >
                  {room.quantity}&nbsp;x&nbsp;&quot;{room.name}&quot;
                </Text>
              ))}
              <div style={{ marginTop: '24px' }}>
                <Text
                  $weight="bold"
                  as="div"
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {t('policies.cancellation.title')}
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Icon $color="green" icon={Check} />
                  <div>
                    <Text $color="green" $size="sm" as="div">
                      <Trans
                        i18nKey="policies.cancellation.free.title"
                        t={t}
                        values={{ date: freeCancelShortDate }}
                        components={[
                          // eslint-disable-next-line react/jsx-key -- for translate
                          <b />,
                        ]}
                      />
                    </Text>
                    <Text $size="sm" as="div" style={{ marginTop: '4px' }}>
                      {t('policies.cancellation.free.description')}
                    </Text>
                    <Text $size="xs" as="div" style={{ marginTop: '4px' }}>
                      {t('policies.cancellation.free.timezone', {
                        timezone,
                        interpolation: { escapeValue: false },
                      })}
                    </Text>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Text
                  $weight="bold"
                  as="div"
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {t('policies.howToCancel.title')}
                </Text>
                <Text $size="sm" as="div" style={{ marginTop: '4px' }}>
                  {t('policies.howToCancel.description')}
                </Text>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Text
                  $weight="bold"
                  as="div"
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {t('policies.prepayment.title')}
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Text>•</Text>
                  <div>
                    <Text $size="sm" $weight="bold" as="div">
                      {t('policies.prepayment.online.title')}
                    </Text>
                    <Text $size="sm" as="div" style={{ marginTop: '4px' }}>
                      {t('policies.prepayment.online.description')}
                    </Text>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <Text
                  $weight="bold"
                  as="div"
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {t('policies.taxes.title')}
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Text>•</Text>
                  <Text $size="sm" as="div">
                    {t('policies.taxes.description', { vat })}
                  </Text>
                </div>
              </div>
            </BookingConditionWrapper>
            <Dialog.Close asChild>
              <IconButton
                $size="sm"
                $variant="ghost"
                icon={X}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                }}
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
