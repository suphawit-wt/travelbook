// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextLink from 'next/link';
import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors } from '@/shared/styles/variables';

export const PropertyItem = styled(NextLink)`
  display: flex;
  padding: 12px 8px;
  color: ${colors.text.base};

  text-decoration: none;
`;

export const Wrapper = styled.ul`
  margin: 10px 0;

  & > li {
    border-top: 1px solid ${colors.separator};

    &:last-child {
      border-bottom: 1px solid ${colors.separator};
    }
  }

  @media ${media.minLaptop} {
    display: none;
  }
`;

export const CardImageWrapper = styled.div`
  width: calc(33% + 0.66 * 8px);
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  height: 278px;

  & > img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardContent = styled.div`
  width: calc(67% - 0.66 * 8px);
  padding-left: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const PriceSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-self: end;
`;
