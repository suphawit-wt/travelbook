// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';

export const Title = styled.div`
  display: none;

  @media ${media.minLaptop} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Wrapper = styled.main`
  /* Layout */

  /* Box model */

  @media ${media.minLaptop} {
    display: inline-block;
    width: 73%;
    vertical-align: top;
  }

  @media ${media.maxLaptop} {
    & > button {
      display: none;
    }
  }
`;

interface PropertyGroupProps {
  $view: 'list' | 'grid';
}

export const PropertyGroup = styled.div<PropertyGroupProps>`
  display: none;

  @media ${media.minLaptop} {
    ${(props) =>
      props.$view === 'list' &&
      css`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `}

    ${(props) =>
      props.$view === 'grid' &&
      css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
      `}
  }
`;

export const LoadMoreResultsWrapper = styled.div`
  margin: 20px 0;
  padding: 0 8px;

  & > button {
    width: 100%;
  }

  @media ${media.minLaptop} {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 36px;
    padding: 0;

    & > button {
      width: initial;
    }
  }
`;
