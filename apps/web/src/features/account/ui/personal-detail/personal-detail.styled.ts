// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius } from '@/shared/styles/variables';

import { type AccountMenuItemProps } from './personal-detail.types';

export const Wrapper = styled.div`
  /* Box model */
  display: flex;
  gap: 36px;
  margin: 20px 0;
`;

export const Sidebar = styled.aside`
  display: none;

  @media ${media.minLaptop} {
    display: flex;
    flex-direction: column;
    flex-basis: 30%;
    width: 30%;
    max-width: 30%;
  }
`;

export const Main = styled.main`
  flex-basis: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  margin-block-end: 80px;

  @media ${media.minLaptop} {
    flex-basis: 70%;
    width: 70%;
    max-width: 70%;
  }
`;

export const IconDisplay = styled.div`
  background-color: ${colors.separator};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.full};
`;

export const AccountMenuItem = styled.div<AccountMenuItemProps>`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 16px;

  ${(props) =>
    props.$isActive &&
    css`
      color: ${colors.blue[500]};
    `}
`;

export const AccountMenuList = styled.ul`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid ${colors.separator};

  & > li {
    &:not(:last-child) {
      border-bottom: 1px solid ${colors.separator};
    }

    & > a:hover > ${AccountMenuItem} {
      color: ${colors.blue[500]};
      text-decoration: underline;
    }
  }
`;

export const TitleProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const AccountInputLabelAndInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;

  & > span:first-child {
    width: 146px;
    min-width: 146px;
  }

  @media ${media.minTablet} {
    flex-direction: row;
  }
`;

export const AccountInputItemGroup = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  & > button {
    align-self: flex-end;

    & > span {
      white-space: nowrap;
    }
  }

  @media ${media.minLaptop} {
    align-self: initial;
    flex-direction: row;
    gap: 70px;
  }
`;

export const AccountInputForm = styled.form`
  padding: 16px 0;
`;

export const AccountInputList = styled.div`
  & > ${AccountInputForm} {
    border-top: 1px solid ${colors.separator};

    &:last-child {
      border-bottom: 1px solid ${colors.separator};
    }
  }
`;

export const InputGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  width: 100%;

  @media ${media.minTablet} {
    flex-direction: row;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  width: 100%;

  & > div {
    width: 100%;
  }
`;

export const SaveButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px;
`;
