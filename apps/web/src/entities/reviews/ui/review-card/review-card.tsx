// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, Image, Text } from '@/shared/ui';

import {
  CountryDisplay,
  ProfileDisplay,
  ReadMoreWrapper,
  UserInfo,
  UserInfoRight,
  Wrapper,
} from './review-card.styled';

import type { ReviewCardProps } from './review-card.types';
import type { FC } from 'react';

export const ReviewCard: FC<ReviewCardProps> = ({
  userName,
  country,
  details,
}) => {
  const { t } = useTranslation(['reviews', 'country']);

  return (
    <Wrapper>
      <UserInfo>
        <div>
          <ProfileDisplay>
            <span>{userName.at(0)}</span>
          </ProfileDisplay>
        </div>
        <UserInfoRight>
          <Text $size="sm" $weight="semibold">
            {userName}
          </Text>
          <CountryDisplay>
            <Image
              alt="country flag"
              height={12}
              src="/assets/images/flags/th.png"
              width={12}
            />
            <Text $color="description" $size="xs">
              {t(country, { ns: 'country' })}
            </Text>
          </CountryDisplay>
        </UserInfoRight>
      </UserInfo>
      <Text $size="sm" style={{ lineHeight: '18px' }}>
        “{details}”
      </Text>
      <ReadMoreWrapper>
        <Button $color="blue" $size="sm" $underline="hover" $variant="link">
          {t('actions.readMore')}
        </Button>
      </ReadMoreWrapper>
    </Wrapper>
  );
};
