// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import {
  Coffee,
  MoreHorizontal,
  ParkingCircle,
  Sprout,
  TentTree,
  Wifi,
} from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Card, Heading, Icon, Text } from '@/shared/ui';

import {
  FacilityCardButton,
  FacilityCardContent,
  FacilityIcon,
  FacilityList,
  Wrapper,
} from './mobile-property-highlight.styled';

export const MobilePropertyHighlight = () => {
  const { t } = useTranslation('property');

  return (
    <Wrapper>
      <Heading
        $size="xl"
        $weight="bold"
        as="h2"
        style={{ marginBottom: '16px' }}
      >
        {t('overview.highlights.title')}
      </Heading>
      <FacilityList>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardContent>
            <FacilityIcon>
              <Icon icon={Coffee} />
            </FacilityIcon>
            <div>
              <Text $size="sm" as="div">
                Breakfast
              </Text>
              <Text
                $color="description"
                $size="xs"
                as="div"
                style={{
                  maxWidth: '135px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Excellent breakfast
              </Text>
            </div>
          </FacilityCardContent>
        </Card.Root>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardContent>
            <FacilityIcon>
              <Icon icon={TentTree} />
            </FacilityIcon>
            <div>
              <Text $size="sm" as="div">
                Views
              </Text>
              <Text
                $color="description"
                $size="xs"
                as="div"
                style={{
                  maxWidth: '135px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Balcony, View, Garden view, Terrace
              </Text>
            </div>
          </FacilityCardContent>
        </Card.Root>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardContent>
            <FacilityIcon>
              <Icon icon={ParkingCircle} />
            </FacilityIcon>
            <div>
              <Text $size="sm" as="div">
                Parking
              </Text>
              <Text
                $color="description"
                $size="xs"
                as="div"
                style={{
                  maxWidth: '135px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Free parking, Private parking, On-site parking
              </Text>
            </div>
          </FacilityCardContent>
        </Card.Root>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardContent>
            <FacilityIcon>
              <Icon icon={Wifi} />
            </FacilityIcon>
            <div>
              <Text $size="sm" as="div">
                Free Wifi
              </Text>
              <Text
                $color="description"
                $size="xs"
                as="div"
                style={{
                  maxWidth: '135px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Internet
              </Text>
            </div>
          </FacilityCardContent>
        </Card.Root>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardContent>
            <FacilityIcon>
              <Icon icon={Sprout} />
            </FacilityIcon>
            <div>
              <Text $size="sm" as="div">
                Wellness
              </Text>
              <Text
                $color="description"
                $size="xs"
                as="div"
                style={{
                  maxWidth: '135px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Hot tub/Jacuzzi
              </Text>
            </div>
          </FacilityCardContent>
        </Card.Root>
        <Card.Root $padding="xs" $variant="surface" as="li">
          <FacilityCardButton>
            <FacilityIcon>
              <Icon $color="blue" icon={MoreHorizontal} />
            </FacilityIcon>
            <Text $color="blue" $size="sm" $weight="bold" as="div">
              View all
            </Text>
          </FacilityCardButton>
        </Card.Root>
      </FacilityList>
    </Wrapper>
  );
};
