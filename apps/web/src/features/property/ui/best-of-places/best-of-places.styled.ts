// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';
import { StyledTrigger } from '@/shared/ui/accordion/accordion.styled';

export const Wrapper = styled.section`
  margin-top: 48px;
`;

export const StyledAccordionTrigger = styled(StyledTrigger)`
  padding: 15px 10px;
  border-radius: 8px;

  background-color: ${colors.blue[100]};
`;

export const PlacesGroup = styled.div`
  padding-block-start: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  list-style-type: none;
  gap: 96px;
`;

export const PlacesItem = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PlacesLinkGroup = styled.ul`
  & > li {
    padding: 2px 0;
  }
`;
