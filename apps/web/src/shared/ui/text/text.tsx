// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Icon } from '../icon';

import { StyledText } from './text.styled';

import type { TextProps } from './text.types';
import type { FC, PropsWithChildren } from 'react';

export const Text: FC<PropsWithChildren<TextProps>> = ({
  children,
  startIcon,
  endIcon,
  $iconColor = 'default',
  $iconSize = 'md',
  ...props
}) => {
  return (
    <StyledText {...props}>
      {startIcon ? (
        <Icon $color={$iconColor} $size={$iconSize} icon={startIcon} />
      ) : null}
      <span>{children}</span>
      {endIcon ? (
        <Icon $color={$iconColor} $size={$iconSize} icon={endIcon} />
      ) : null}
    </StyledText>
  );
};
