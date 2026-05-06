// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { forwardRef } from 'react';

import { Icon } from '../icon';
import { Tooltip } from '../tooltip';

import { StyledIconButton } from './icon-button.styled';

import type { IconButtonProps } from './icon-button.types';
import type { PropsWithChildren } from 'react';

export const IconButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IconButtonProps>
>(
  (
    {
      type = 'button',
      icon,
      tooltip,
      $iconColor = 'default',
      $size = 'md',
      ...props
    },
    ref,
  ) => {
    const buttonContent = (
      <StyledIconButton ref={ref} $size={$size} type={type} {...props}>
        <Icon $color={$iconColor} $size={$size} icon={icon} />
      </StyledIconButton>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} side="bottom" sideOffset={8}>
          {buttonContent}
        </Tooltip>
      );
    }

    return buttonContent;
  },
);

IconButton.displayName = 'IconButton';
