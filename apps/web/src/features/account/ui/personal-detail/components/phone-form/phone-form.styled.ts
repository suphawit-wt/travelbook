// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, typography } from '@/shared/styles/variables';

export const PhoneCountryCodeSelect = styled.select`
  /* Box model */
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  flex-shrink: 0;
  border: 0;
  padding: 0;
  margin: 0;

  /* Styling */
  background-color: ${colors.background.base};

  &:focus {
    outline: none;
  }
`;

export const PhoneNumberInputGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 12px;
  align-items: flex-start;
  flex-grow: initial;
  height: initial;
`;

export const PhoneNumberSelectGroup = styled.div`
  direction: ltr !important;
  width: auto;
  position: relative;
  padding-block: 8px;
  padding-inline-start: 8px;
  padding-inline-end: 32px;
  border: 1px solid ${colors.gray[500]};
  border-radius: 4px;
  height: 36px;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;

  & > span {
    display: flex;
    align-items: center;

    position: absolute;
    inset-inline-end: 8px;
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const PhoneCountryCodeLabel = styled.label`
  flex-shrink: 0;
  text-transform: uppercase;
  font-size: ${typography.fontSize.small};
`;

export const PhoneInputWrapper = styled.div`
  flex-basis: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  border: 1px solid ${colors.gray[500]};
  border-radius: 4px;

  & > input {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    border: none;
    background-color: ${colors.background.base};
    border-radius: 4px;

    &:focus {
      outline: none;
    }
  }
`;
