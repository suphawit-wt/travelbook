// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, spacing } from '@/shared/styles/variables';

export const HotelPageTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.small};
`;

export const AddressGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${spacing.gap.small};
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 10px;

  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const GalleryReviewGroup = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;

  max-height: 600px;
`;

export const GallerySideBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.large};
`;

export const MapBox = styled.div`
  border: 1px solid ${colors.separator};
  border-radius: 4px;
  height: 100%;
`;

export const AboutAndHilights = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const AboutGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 70%;
`;

export const GeniusDiscountGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const HilightsBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.blue[100]};
  padding: 16px;
  flex-basis: 30%;
  margin-left: 40px;
`;

export const FacilityItem = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-right: 10px;
  }
`;

export const FacilityGroup = styled.div`
  display: flex;
  gap: 20px;
`;

export const TopLocation = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  & > svg {
    width: 1em;
    height: 1em;
  }
`;
