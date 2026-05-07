// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

import { Icon } from '../icon';

import { Header, StyledTrigger, Title } from './accordion.styled';

import type { TriggerProps } from './accordion.types';
import type { PropsWithChildren } from 'react';

export const Trigger = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<TriggerProps>
>(({ children, ...props }, ref) => {
  return (
    <Header>
      <StyledTrigger ref={ref} {...props}>
        <Title>{children}</Title>
        <Icon $color="default" icon={ChevronDown} />
      </StyledTrigger>
    </Header>
  );
});

Trigger.displayName = 'Trigger';
