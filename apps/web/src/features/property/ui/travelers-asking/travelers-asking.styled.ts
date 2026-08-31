// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors, radius } from '@/shared/styles/variables';

export const Wrapper = styled.div`
  margin-top: 28px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const QuestionCardGroup = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
`;

export const TravelersQuestionCard = styled.ul`
  border: 1px solid ${colors.separator};
  border-radius: ${radius.large};
  padding: 0 14px;

  & > li:last-child {
    border: 0;
  }
`;

export const TravelersQuestionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  border-block-end: 1px solid ${colors.separator};
`;

export const QuestionButton = styled.button`
  background-color: transparent;
  display: flex;
  padding: 16px 0;
  gap: 10px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const LookingQuestion = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
