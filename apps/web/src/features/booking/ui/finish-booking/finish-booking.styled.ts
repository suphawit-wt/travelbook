// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 80px;

  @media ${media.maxLaptop} {
    background-color: ${colors.background.secondary};
    flex-direction: column;
    margin-bottom: 0px;
  }
`;

export const Sidebar = styled.aside`
  flex-basis: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  @media ${media.minLaptop} {
    flex-basis: 32%;
    width: 32%;
    max-width: 32%;
    gap: 16px;
  }
`;

export const Main = styled.main`
  flex-basis: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-block-end: 80px;

  @media ${media.minLaptop} {
    flex-basis: 68%;
    width: 68%;
    max-width: 68%;
  }
`;

export const Card = styled.div`
  padding: 14px;
  border: 1px solid ${colors.separator};
  background-color: ${colors.background.base};

  @media ${media.minLaptop} {
    border-radius: 8px;
  }
`;

export const InputGroup = styled.div`
  & > label {
    padding-block-end: 4px;
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

export const PaymentMethodList = styled.ul``;
