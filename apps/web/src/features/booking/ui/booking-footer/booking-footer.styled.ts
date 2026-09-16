// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const Wrapper = styled.footer`
  /* Box model */
  padding: 18px 0;

  /* Styling */
  background-color: ${colors.primary};
  color: ${colors.white};

  @media ${media.minLaptop} {
    background-color: ${colors.background.secondary};

    a {
      color: ${colors.blue[500]};
    }

    p {
      color: ${colors.text.description};
    }
  }
`;

export const Nav = styled.nav`
  margin: 10px 0 25px;

  & > ul {
    display: flex;
    flex-wrap: wrap;

    & > li {
      &:not(:first-child) {
        & > a {
          margin-inline-start: 6px;
        }
      }

      &:not(:last-child) {
        & > a {
          margin-inline-end: 6px;
        }
      }
    }

    & > li + li::before {
      content: '|';
    }
  }
`;
