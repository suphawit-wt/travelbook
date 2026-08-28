// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { selectIsAuthenticated } from '@/features/auth/store/auth.selectors';
import { useAppSelector } from '@/shared/hooks/store';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { ButtonLink, Card, Heading, Image, Link, Text } from '@/shared/ui';

import { ImageWrapper, Wrapper } from './genius-banner.styled';

export const GeniusBanner = () => {
  const { t } = useTranslation('common');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) return null;

  return (
    <Wrapper $variant="surface">
      <Card.Content
        $padding="md"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <Heading $size="xl" $weight="bold" as="h3">
            {t('genius.banner.title')}
          </Heading>
          <Text $size="sm" as="p" style={{ marginTop: '3px' }}>
            {t('genius.banner.description', { count: 10 })}
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '16px',
              gap: '16px',
            }}
          >
            <ButtonLink
              $color="blue"
              $size="sm"
              $variant="outline"
              href="auth/sign-in"
            >
              {t('genius.banner.actions.signIn')}
            </ButtonLink>
            <Link
              $color="blue"
              $size="sm"
              $underline="hover"
              href="auth/sign-in"
            >
              {t('genius.banner.actions.createAccount')}
            </Link>
          </div>
        </div>
        <ImageWrapper>
          <Image
            alt="genius giftbox"
            height={120}
            src="/assets/images/Genius_GiftBox.png"
            width={100}
          />
        </ImageWrapper>
      </Card.Content>
    </Wrapper>
  );
};
