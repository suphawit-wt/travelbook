// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

export const ReviewItem = styled.li``;

export const ReviewsGroup = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

export const ReviewItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 4px;
`;

export const MobileReviewsGroup = styled.ul`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  & > div > ${ReviewItem} {
    margin-bottom: 16px;
  }

  & > ${ReviewItem} {
    margin-bottom: 16px;
  }
`;
