// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Button, Text } from '@/shared/ui';

import { Wrapper } from './reserve-cta.styled';

import type { ReserveCTAProps } from './reserve-cta.types';
import type { FC } from 'react';

export const ReserveCTA: FC<ReserveCTAProps> = ({ nights }) => {
  return (
    <Wrapper>
      <Button $color="blue">Reserve for {nights} nights</Button>
      <Text $color="description" $size="sm" style={{ marginTop: '4px' }}>
        You won&apos;t be charged yet
      </Text>
    </Wrapper>
  );
};
