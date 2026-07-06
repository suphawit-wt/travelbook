// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  & > nav {
    & > span {
      margin-left: 20px;
    }

    & > ul {
      /* Layout */
      display: flex;
      flex-direction: column;

      /* Box model */
      margin-top: 10px;
      margin-bottom: 50px;

      & > li {
        & > a,
        button {
          display: flex;
          align-items: flex-start;

          width: 100%;
          padding: 18px 18px;

          border-radius: unset;

          & div + span {
            margin-left: 1.5rem;
          }
        }
      }
    }
  }
`;

export const ProfileMenu = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenterWithGap}
  user-select: none;

  margin: 80px 20px 25px;
`;

export const ProfileAvatar = styled.div`
  /* Layout */
  display: inline-flex;
  user-select: none;
  position: relative;
  overflow: hidden;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border: 2px solid ${colors.yellow[500]};
  border-radius: ${radius.full};
  width: 48px;
  height: 48px;

  & > img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export const ProfileInfo = styled.div`
  /* Layout */
  ${mixins.display.flex.flexColumnFlexStart}
  user-select: none;
`;
