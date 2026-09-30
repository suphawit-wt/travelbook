// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Card = styled.div`
  padding: 14px;
  border: 1px solid ${colors.separator};
  background-color: ${colors.background.base};

  @media ${media.minLaptop} {
    border-radius: 8px;
  }
`;

export const FormActionGroup = styled.div`
  display: flex;
  justify-content: center;

  @media ${media.minLaptop} {
    justify-content: flex-end;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media ${media.maxLaptop} {
    flex-direction: column;
  }
`;

export const ConsentAndPrivacyGroup = styled.div`
  @media ${media.maxLaptop} {
    padding: 0px 16px;
  }
`;
