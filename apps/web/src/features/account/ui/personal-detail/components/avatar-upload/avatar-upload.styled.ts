// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius } from '@/shared/styles/variables';

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: transparent;

  &:hover {
    background-color: ${colors.overlay.base};
  }
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    border: 2px solid ${colors.yellow[500]};
    border-radius: ${radius.full};
  }
`;

export const ProfileImageDialogWrapper = styled.div`
  padding: 70px 16px 16px;
  gap: 10px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;

  @media ${media.minLaptop} {
    padding: 16px;
    flex-direction: row-reverse;
    min-width: 600px;
  }
`;

export const ProfileImageDialogTitle = styled.div`
  @media ${media.maxLaptop} {
    & > button {
      margin-inline-start: 16px;
    }
  }
`;

export const ProfileImageUploadWrapper = styled.div`
  width: 250px;
  height: 250px;

  .filepond--root {
    font-size: inherit;
  }
`;
