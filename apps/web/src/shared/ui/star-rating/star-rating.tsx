// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Star } from 'lucide-react';

import { colors } from '@/shared/styles/variables';

import { Wrapper } from './star-rating.styled';

import type { StarRatingProps } from './star-rating.types';
import type { FC } from 'react';

export const StarRating: FC<StarRatingProps> = ({ count = 1, size = 'md' }) => {
  let iconSize = 0;

  switch (size) {
    case 'xs':
      iconSize = 14;
      break;
    case 'sm':
      iconSize = 16;
      break;
    case 'md':
      iconSize = 20;
      break;
    case 'lg':
      iconSize = 24;
      break;
  }

  return (
    <Wrapper>
      {Array.from({ length: count }, (_, i) => (
        <Star
          key={i}
          fill={colors.yellow[500]}
          size={iconSize}
          strokeWidth={0}
        />
      ))}
    </Wrapper>
  );
};
