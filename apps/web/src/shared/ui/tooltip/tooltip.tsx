// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Portal, Root, Trigger } from '@radix-ui/react-tooltip';

import { Arrow, Content } from './tooltip.styled';

import type { TooltipProps } from './tooltip.types';
import type { FC, PropsWithChildren } from 'react';

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  children,
  content,
  showArrow,
  open,
  delayDuration,
  isError = false,
  ...contentProps
}) => {
  const rootProps = { open, delayDuration };

  return (
    <Root {...rootProps}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <Content $isError={isError} {...contentProps}>
          {content}
          {showArrow ? <Arrow $isError={isError} /> : null}
        </Content>
      </Portal>
    </Root>
  );
};
