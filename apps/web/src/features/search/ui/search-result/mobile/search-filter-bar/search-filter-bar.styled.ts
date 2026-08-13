// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, zIndex } from '@/shared/styles/variables';

interface ListProps {
  $isActive?: boolean;
}

export const List = styled.ul<ListProps>`
  display: flex;
  justify-content: center;
  padding: 8px 20px;
  position: sticky;
  top: 0;
  background-color: ${colors.background.base};
  z-index: ${zIndex.sticky};
  overflow: hidden;

  & > li {
    display: flex;
    justify-content: center;
    flex-grow: 1;

    & > button {
      width: 100%;
    }
  }

  @media ${media.minLaptop} {
    display: none;
  }

  ${(props) =>
    props.$isActive &&
    css`
      box-shadow: 0px 2px 8px 0px #1a1a1a29;
    `}
`;
