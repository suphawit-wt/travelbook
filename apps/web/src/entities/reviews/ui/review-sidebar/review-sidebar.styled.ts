// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius, typography } from '@/shared/styles/variables';
import { Swiper } from '@/shared/ui';

export const Wrapper = styled.div`
  border-radius: 4px;
  border: 1px solid ${colors.separator};
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 14px 12px;
  border-bottom: 1px solid ${colors.separator};
`;

export const Content = styled.div`
  min-height: 150px;
`;

export const Footer = styled.div`
  border-top: 1px solid ${colors.separator};
  padding: 10px 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

export const Rating2 = styled.span`
  /* Box model */
  display: flex;
  align-items: center;
  padding: 8px 5px;

  /* Styling */
  border: 1px solid ${colors.text.base};
  border-radius: ${radius.small};
  border-bottom-left-radius: 0;
`;

export const ReviewItem = styled.div`
  height: 120px;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ReviewerInfo = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

export const ProfileDisplay = styled.div`
  width: 24px;
  height: 24px;
  font-size: ${typography.fontSize.extraSmall};
  border-radius: ${radius.full};
  background-color: ${colors.green[700]};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

export const CountryDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 10px;
`;

export const SwiperRoot = styled(Swiper.Root)`
  .swiper-button-next,
  .swiper-button-prev {
    /* Styling */
    background-color: transparent;
    color: ${colors.text.base};
    box-shadow: none;

    width: 33px;
    height: 33px;

    &:hover {
      background-color: ${colors.overlay.base};
    }
  }

  .swiper-button-next {
    right: 0px;
  }

  .swiper-button-prev {
    left: 0px;
  }
`;
