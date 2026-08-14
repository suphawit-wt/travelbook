// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Tag } from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Heading, HoverCard, Icon, Text } from '@/shared/ui';

export const WePriceMatch = () => {
  const { t } = useTranslation('common');

  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Button $color="blue" $size="sm" $variant="ghost" startIcon={Tag}>
          {t('priceMatch.title')}
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          sideOffset={8}
          style={{
            width: '360px',
          }}
        >
          <Heading $color="green" $size="sm" $weight="bold" as="h3">
            {t('priceMatch.title')}
          </Heading>
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <Icon $color="green" $size="lg" icon={Tag} />
            <Text $size="sm" as="div">
              {t('priceMatch.description')}
            </Text>
          </div>
          <HoverCard.Arrow />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
