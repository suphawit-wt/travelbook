// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Check } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

import { Icon, Image, RadioCards, Text } from '@/shared/ui';
import { getLanguageMetadata } from '@/shared/utils/i18n';

import { LanguageDisplay, LanguageLink } from './language-button.styled';

import type { LanguageButtonProps } from './language-button.types';
import type { FC } from 'react';

export const LanguageButton: FC<LanguageButtonProps> = ({
  symbol,
  selected,
  label,
}) => {
  const { flag } = getLanguageMetadata(symbol);

  const pathname = usePathname();
  const [, , ...restPathname] = pathname.split('/');
  const path = restPathname.join('/');
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const href = `/${symbol}/${path}${queryString ? `?${queryString}` : ''}`;

  return (
    <LanguageLink href={href}>
      <RadioCards.Item disabled={selected} value={symbol}>
        <LanguageDisplay>
          <Image
            $shape="circle"
            alt="Country flag"
            height="24"
            src={flag}
            width="24"
          />
          <Text $size="sm" as="span">
            {label}
          </Text>
        </LanguageDisplay>
        {selected ? (
          <div>
            <Icon icon={Check} />
          </div>
        ) : null}
      </RadioCards.Item>
    </LanguageLink>
  );
};
