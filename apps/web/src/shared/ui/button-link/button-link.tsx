// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { forwardRef } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';

import { Icon } from '../icon';
import { Tooltip } from '../tooltip';

import { StyledButtonLink } from './button-link.styled';

import type { ButtonLinkProps } from './button-link.types';
import type { PropsWithChildren } from 'react';

export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<ButtonLinkProps>
>(
  (
    { children, href, startIcon, endIcon, tooltip, $iconSize = 'md', ...props },
    ref,
  ) => {
    const { i18n } = useTranslation();
    const lng = i18n.resolvedLanguage ?? 'en';
    let url: string;

    if (href === '/') {
      url = `/${lng}`;
    } else {
      url = `/${lng}/${href as string}`;
    }

    const buttonContent = (
      <StyledButtonLink ref={ref} href={url} {...props}>
        {startIcon ? <Icon $size={$iconSize} icon={startIcon} /> : null}
        {children ? <span>{children}</span> : null}
        {endIcon ? <Icon $size={$iconSize} icon={endIcon} /> : null}
      </StyledButtonLink>
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

ButtonLink.displayName = 'ButtonLink';
