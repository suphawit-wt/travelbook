// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { Size, Weight } from '@/shared/types/components';

import { type FeedbackBox } from './review-info.styled';

import type { ComponentPropsWithoutRef } from 'react';

type ReviewInfoVariants = 'landscape' | 'stack';

interface RatingProps {
  $size?: Size;
}

export interface ReviewInfoProps
  extends RatingProps, ComponentPropsWithoutRef<typeof FeedbackBox> {
  reviews: number;
  rating: number;
  variants?: ReviewInfoVariants;
  $weight?: Weight;
  $align?: 'left' | 'right';
}
