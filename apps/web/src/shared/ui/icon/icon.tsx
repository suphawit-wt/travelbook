// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { forwardRef } from 'react';

import { Wrapper } from './icon.styled';

import type { IconProps } from './icon.types';

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconLucide, $color = 'default', $size = 'md', ...props }, ref) => {
    return (
      <Wrapper $color={$color} $size={$size}>
        <IconLucide ref={ref} {...props} />
      </Wrapper>
    );
  },
);

Icon.displayName = 'Icon';
