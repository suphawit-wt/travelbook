// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { forwardRef } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';

import { Icon } from '../icon';
import { Tooltip } from '../tooltip';

import { StyledIconButtonLink } from './icon-button-link.styled';

import type { IconButtonLinkProps } from './icon-button-link.types';
import type { PropsWithChildren } from 'react';

export const IconButtonLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<IconButtonLinkProps>
>(
  (
    { href, icon, tooltip, $iconColor = 'default', $size = 'md', ...props },
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
      <StyledIconButtonLink ref={ref} $size={$size} href={url} {...props}>
        <Icon $color={$iconColor} $size={$size} icon={icon} />
      </StyledIconButtonLink>
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

IconButtonLink.displayName = 'IconButtonLink';
