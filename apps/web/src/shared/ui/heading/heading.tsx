// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Icon } from '../icon';

import { StyledHeading } from './heading.styled';

import type { HeadingProps } from './heading.types';
import type { FC, PropsWithChildren } from 'react';

export const Heading: FC<PropsWithChildren<HeadingProps>> = ({
  children,
  startIcon,
  endIcon,
  $iconColor = 'default',
  $iconSize = 'md',
  ...props
}) => {
  return (
    <StyledHeading {...props}>
      {startIcon ? (
        <Icon $color={$iconColor} $size={$iconSize} icon={startIcon} />
      ) : null}
      <span>{children}</span>
      {endIcon ? (
        <Icon $color={$iconColor} $size={$iconSize} icon={endIcon} />
      ) : null}
    </StyledHeading>
  );
};
