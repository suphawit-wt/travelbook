// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { motion } from 'motion/react';
import { styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, spacing, typography } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 420px;

  margin-left: auto;
  margin-right: auto;

  @media ${media.minLaptop} {
    max-width: 340px;
  }
`;

export const FormGroup = styled(motion.div)`
  display: flex;
  gap: 10px;
  position: absolute;
`;

export const FormWrapper = styled.div`
  width: 90vw;

  @media ${media.minLaptop} {
    max-width: 332px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.gap.medium};

  margin-bottom: 20px;

  & > button {
    padding: 14px 18px;
  }
`;

export const SignInWithGroup = styled.div`
  margin: 26px 0;
  ${mixins.display.flex.flexContentCenter}
  gap: 36px;
`;

export const SeparatorText = styled.div`
  display: flex;
  align-items: center;
  text-align: center;

  font-size: ${typography.fontSize.small};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${colors.separator};
  }

  &:not(:empty)::before {
    margin-right: 0.5em;
  }

  &:not(:empty)::after {
    margin-left: 0.5em;
  }
`;
