// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, typography } from '@/shared/styles/variables';

export const Card = styled.div`
  padding: 14px;
  border: 1px solid ${colors.separator};
  background-color: ${colors.background.base};

  @media ${media.minLaptop} {
    border-radius: 8px;
  }
`;

export const CheckInOutItem = styled.time`
  display: inline-block;
  position: relative;
`;

export const DateCheckInOutSummary = styled.div`
  display: flex;
  flex-wrap: nowrap;

  & > ${CheckInOutItem}:first-child {
    padding-inline-end: 16px;
  }

  & > ${CheckInOutItem}:last-child {
    padding-inline-start: 16px;
  }
`;

export const InputFormGroup = styled.div`
  margin: 16px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media ${media.minLaptop} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InputGroup = styled.div`
  & > label {
    padding-block-end: 4px;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const SelectInputGroup = styled.div`
  isolation: isolate;
  position: relative;

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

export const RoomBenefitsList = styled.ul`
  & > li {
    margin-block-end: 4px;

    &:last-child {
      margin-block-end: 0;
    }
  }
`;

export const AddonList = styled.ul`
  & > li {
    padding: 16px 0;
    border-block-end: 1px solid ${colors.separator};

    &:first-child {
      padding-block-start: 0;
    }

    &:last-child {
      padding-block-end: 0;
      border: 0;
    }
  }
`;

export const AddonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  & div > svg {
    width: 36px;
    height: 36px;
  }

  & > svg {
    width: 36px;
    height: 36px;
  }
`;

export const AddonInputGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const AddonInputDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TextAreaInput = styled.textarea`
  box-sizing: border-box;

  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 56px;
  height: 76px;

  color: ${colors.text.base};
  background-color: ${colors.background.base};
  border-color: ${colors.gray[500]};
  border-radius: 4px;

  transition: height 0.25s ease;

  &:focus {
    border: 2px solid ${colors.blue[500]};
    outline: none;
  }
`;

export const FormActionGroup = styled.div`
  margin-top: 16px;

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
