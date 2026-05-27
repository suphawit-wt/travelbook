// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
  zIndex,
} from '@/shared/styles/variables';
import { InputGroup } from '@/shared/ui/input/input.styled';

export const Form = styled.form`
  /* Layout */
  position: absolute;
  bottom: -240px;
  z-index: ${zIndex.content};

  /* Box model */
  width: 100%;

  @media ${media.minLaptop} {
    /* Layout */
    bottom: -60px;
  }
`;

export const SearchBar = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.gap.extraSmall};

  /* Box model */
  padding: 4px;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border-radius: ${radius.medium};
  box-shadow: ${shadow.large};

  @media ${media.minLaptop} {
    grid-template-columns: repeat(3, 1fr) auto;
  }

  & > ${InputGroup}:first-child {
    /* Layout */
    ${mixins.display.flex.flexItemCenter}

    /* Box model */
      border: 1px solid transparent;

    /* Styling */
    background-color: ${colors.background.base};
    user-select: none;
    border-radius: ${radius.small};

    &:hover {
      border: 1px solid ${colors.red[400]};
    }

    & > div:first-child {
      margin-left: 14px;
    }

    & > input {
      /* Box model */
      width: 100%;
      height: 50px;
      margin-left: 12px;
      border: none;

      /* Styling */
      background-color: ${colors.background.base};
      font-size: ${typography.fontSize.small};
      font-weight: ${typography.fontWeight.medium};
      border-radius: ${radius.small};

      &::placeholder {
        color: ${colors.text.base};
      }

      &:focus {
        outline: none;
      }

      &:focus::placeholder {
        color: ${colors.text.description};
      }
    }

    & > input[type='search']::-webkit-search-cancel-button {
      margin: 0 12px;
      padding: 1px;
      cursor: pointer;
    }
  }

  & > button:last-child {
    /* Box model */
    width: 100%;
    height: 100%;
    min-width: 110px;

    /* Styling */
    line-height: 24px;

    @media ${media.minLaptop} {
      padding: 16px 24px;
    }
  }
`;

export const SearchBarOptions = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenterWithGap}

  /* Box model */
  margin-top: 15px;
`;
