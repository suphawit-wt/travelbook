// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';

import { StyledLink } from './link.styled';

import type { LinkProps } from './link.types';
import type { FC, PropsWithChildren } from 'react';

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  children,
  href = '',
  $enableHoverColor = false,
  ...props
}) => {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage ?? 'en';
  let url: string;

  if (href === '/') {
    url = `/${lng}`;
  } else {
    url = `/${lng}/${href as string}`;
  }

  return (
    <StyledLink $enableHoverColor={$enableHoverColor} href={url} {...props}>
      {children}
    </StyledLink>
  );
};
