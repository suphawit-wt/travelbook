// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, zIndex } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  margin: 40px 0;

  @media ${media.maxLaptop} {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside`
  flex-basis: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${media.minLaptop} {
    flex-basis: 32%;
    width: 32%;
    max-width: 32%;
  }
`;

export const Main = styled.main`
  flex-basis: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  @media ${media.minLaptop} {
    flex-basis: 68%;
    width: 68%;
    max-width: 68%;
    margin-block-end: 80px;
  }
`;

export const Card = styled.div`
  padding: 16px;
  border: 1px solid ${colors.separator};
  border-radius: 8px;
`;

export const ConfirmationCodeCard = styled.div`
  padding: 16px;
  background-color: ${colors.red[100]};
  border: 1px solid ${colors.red[500]};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const BookingSummaryCard = styled.div`
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  box-shadow: 0px 1px 8px -4px ${colors.shadow.card};

  @media ${media.maxLaptop} {
    flex-direction: column;
  }
`;

export const ImageContainer = styled.div`
  height: 72px;
  width: 72px;
  display: inline-flex;
  vertical-align: top;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;

  /* Layout */
  position: relative;
  overflow: hidden;

  /* Box model */
  border-radius: 4px;

  & > img {
    position: absolute;
    object-fit: cover;
    z-index: ${zIndex.base};
    transition: transform 0.3s;

    /* Box model */
    width: 100%;
    height: 100%;
  }

  &:hover {
    & > img {
      transform: scale(1.05);
    }
  }
`;

export const SummaryContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const SummaryDetail = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
`;

export const BetterDealsCard = styled.div`
  margin-top: 20px;
  padding: 16px;
  border: 1px solid ${colors.separator};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  @media ${media.maxLaptop} {
    flex-direction: column;

    & > div:last-child {
      align-self: flex-end;
    }
  }
`;

export const BetterDealsContent = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: 10px;
`;
