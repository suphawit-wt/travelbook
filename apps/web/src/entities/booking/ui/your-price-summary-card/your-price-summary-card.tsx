// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Banknote } from 'lucide-react';
import { type FC, useState } from 'react';

import { selectCurrency } from '@/features/user/store/user-preferences.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Heading, Icon, Text } from '@/shared/ui';

import {
  Card,
  PriceInfoBox,
  PriceInfoItem,
  TotalPriceBox,
  TotalPriceDetail,
  TotalPriceDisplay,
} from './your-price-summary-card.styled';

import type { YourPriceSummaryCardProps } from './your-price-summary-card.types';

export const YourPriceSummaryCard: FC<YourPriceSummaryCardProps> = ({
  price,
  taxesAndFees,
}) => {
  const currency = useAppSelector(selectCurrency);

  const { t } = useTranslation('booking');

  const [showPriceInfoDetails, setShowPriceInfoDetails] = useState(true);

  const togglePriceInfoDetails = () => {
    setShowPriceInfoDetails(!showPriceInfoDetails);
  };

  return (
    <Card style={{ padding: '0px' }}>
      <div style={{ padding: '16px' }}>
        <Heading $size="md" $weight="bold" as="h2">
          {t('booking.price.summaryTitle')}
        </Heading>
      </div>
      <TotalPriceBox>
        <TotalPriceDisplay>
          <Text $size="2xl" $weight="bold" as="div">
            {t('booking.price.total')}
          </Text>
          <Text $size="2xl" $weight="bold" as="div">
            {t(`price.${currency}`, { amount: price ?? 0, ns: 'common' })}
          </Text>
        </TotalPriceDisplay>
        <TotalPriceDetail>
          <Text $size="sm" as="div" style={{ marginTop: '4px' }}>
            {t('booking.price.includesTaxes')}
          </Text>
        </TotalPriceDetail>
      </TotalPriceBox>
      <PriceInfoBox>
        <Text $weight="bold" as="div" style={{ marginBlockEnd: '10px' }}>
          {t('booking.price.info')}
        </Text>
        <PriceInfoItem>
          <Icon icon={Banknote} />
          <div style={{ width: '100%' }}>
            <Text $size="sm" as="div" style={{ marginBlockEnd: '6px' }}>
              {t('booking.price.includesTaxesAmount', {
                currency,
                price: taxesAndFees ?? 0,
              })}
            </Text>
            {showPriceInfoDetails ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text $color="description" $size="sm">
                  {t('booking.price.vat', { vat: 7 })}
                </Text>
                <Text $color="description" $size="sm">
                  {t(`price.${currency}`, {
                    amount: taxesAndFees ?? 0,
                    ns: 'common',
                  })}
                </Text>
              </div>
            ) : null}
          </div>
        </PriceInfoItem>
      </PriceInfoBox>
      <Button
        $color="blue"
        $size="sm"
        $variant="ghost"
        style={{ margin: '0 0 8px 8px', padding: '8px 6px' }}
        onClick={togglePriceInfoDetails}
      >
        {showPriceInfoDetails ? (
          <span>{t('actions.hideDetails')}</span>
        ) : (
          <span>{t('actions.showDetails')}</span>
        )}
      </Button>
    </Card>
  );
};
