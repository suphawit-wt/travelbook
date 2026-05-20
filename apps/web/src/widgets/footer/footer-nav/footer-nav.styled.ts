// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, spacing } from '@/shared/styles/variables';
import { Container } from '@/shared/ui';

import type { FooterNavContainerProps } from './footer-nav.types';

export const Wrapper = styled.section`
  /* Box model */
  padding: 18px 0;

  /* Styling */
  background-color: ${colors.background.secondary};
`;

export const NavContainer = styled(Container)<FooterNavContainerProps>`
  /* Layout */
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.gap.large};
  ${mixins.display.showOnly}

  @media ${media.minLaptop} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const Content = styled.nav`
  & > ul {
    /* Layout */
    display: flex;
    flex-direction: column;
    gap: ${spacing.gap.medium};

    /* Box model */
    margin-top: 12px;
  }
`;
