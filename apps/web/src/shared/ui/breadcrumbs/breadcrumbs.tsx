// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { ChevronRight } from 'lucide-react';

import { Icon } from '../icon';
import { Link as LinkComponent } from '../link';
import { Text } from '../text';

import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react';

type LinkProps = ComponentPropsWithoutRef<typeof LinkComponent>;

export const Separator = () => {
  return <Icon icon={ChevronRight} />;
};

export const Link = ({ children, ...props }: LinkProps) => (
  <LinkComponent $color="blue" $underline="hover" {...props}>
    {children}
  </LinkComponent>
);

export const Page: FC<PropsWithChildren> = ({ children }) => {
  return <Text>{children}</Text>;
};
