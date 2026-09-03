// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Baby,
  Bed,
  BedSingle,
  CreditCard,
  Info,
  LogIn,
  LogOut,
  PartyPopper,
  PawPrint,
  PersonStanding,
} from 'lucide-react';
import { Trans } from 'react-i18next/TransWithoutContext';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Badge, Card, Heading, Link, Separator, Text } from '@/shared/ui';

import {
  ChildPoliciesGroup,
  ExtraBedPoliciesContent,
  ExtraBedPoliciesItem,
  ExtraBedPoliciesTitle,
  RuleDetail,
  RuleItem,
  RuleItemContent,
  RuleTitle,
} from './house-rules-card.styled';

import type { HouseRulesCardProps } from './house-rules-card.types';
import type { FC } from 'react';

export const HouseRulesCard: FC<HouseRulesCardProps> = ({
  rules,
  checkInOutRange,
}) => {
  const { t } = useTranslation('property');

  return (
    <Card.Root $padding="md" $variant="surface">
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={LogIn}>
              {t('houseRules.checkIn.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            {t('houseRules.checkIn.time', {
              from: checkInOutRange.checkInFrom,
              to: checkInOutRange.checkInUntil,
            })}
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={LogOut}>
              {t('houseRules.checkOut.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            {t('houseRules.checkOut.time', {
              from: checkInOutRange.checkOutFrom,
              to: checkInOutRange.checkOutUntil,
            })}
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={Info}>
              {t('houseRules.cancellation.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            <Trans
              i18nKey="houseRules.cancellation.description"
              t={t}
              components={[
                // eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-has-content -- for translate
                <Link
                  $enableHoverColor
                  $color="blue"
                  $underline="always"
                  href="conditions"
                />,
              ]}
            />
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      {rules?.damageDeposit.required ? (
        <RuleItem>
          <RuleItemContent>
            <RuleTitle>
              <Text $weight="bold" startIcon={Info}>
                {t('houseRules.deposit.title')}
              </Text>
            </RuleTitle>
            <RuleDetail>
              {t('houseRules.deposit.description', {
                currency: 'THB',
                price: 10000,
                days: 14,
              })}
            </RuleDetail>
          </RuleItemContent>
          <Separator />
        </RuleItem>
      ) : null}
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={Baby}>
              {t('houseRules.children.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            <ChildPoliciesGroup>
              <Heading $weight="bold" as="h3" style={{ margin: '0 0 16px' }}>
                {t('houseRules.children.child.title')}
              </Heading>
              {rules?.childPolicies.allowed ? (
                <Text as="p" style={{ margin: '1em 0' }}>
                  {t('houseRules.children.allowed')}
                </Text>
              ) : null}
              {rules?.childPolicies.chargedAsAdultsAge ? (
                <Text as="p" style={{ margin: '1em 0' }}>
                  {t('houseRules.children.chargedAsAdults', {
                    age: rules.childPolicies.chargedAsAdultsAge,
                  })}
                </Text>
              ) : null}
              <Text as="p" style={{ margin: '1em 0' }}>
                {t('houseRules.children.correctPrice')}
              </Text>
            </ChildPoliciesGroup>

            <Heading $weight="bold" as="h3" style={{ margin: '0 0 16px' }}>
              {t('houseRules.beds.title')}
            </Heading>
            <ExtraBedPoliciesItem>
              <ExtraBedPoliciesTitle>
                {t('houseRules.beds.under3Years')}
              </ExtraBedPoliciesTitle>
              <ExtraBedPoliciesContent>
                <Text startIcon={Bed} style={{ flex: '1' }}>
                  {t('houseRules.beds.crib')}
                </Text>
                <Text $color="green" style={{ flex: '1' }}>
                  {t('houseRules.beds.free')}
                </Text>
              </ExtraBedPoliciesContent>
            </ExtraBedPoliciesItem>
            <ExtraBedPoliciesItem>
              <ExtraBedPoliciesTitle>
                {t('houseRules.beds.5YearsAbove')}
              </ExtraBedPoliciesTitle>
              <ExtraBedPoliciesContent>
                <Text startIcon={BedSingle} style={{ flex: '1' }}>
                  {t('houseRules.beds.extraBed')}
                </Text>
                <Text style={{ flex: '1' }}>
                  {t('houseRules.beds.price', {
                    currency: 'THB',
                    price: 2000,
                  })}
                </Text>
              </ExtraBedPoliciesContent>
            </ExtraBedPoliciesItem>
            <Text as="p" style={{ margin: '1em 0' }}>
              {t('houseRules.beds.disclaimer.price')}
            </Text>
            <Text as="p" style={{ margin: '1em 0' }}>
              {t('houseRules.beds.disclaimer.extraBed')}
            </Text>
            <Text as="p" style={{ margin: '1em 0' }}>
              {t('houseRules.beds.disclaimer.availability')}
            </Text>
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={PersonStanding}>
              {t('houseRules.age.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            {rules?.minCheckinAge ? (
              <span>
                {t('houseRules.age.minimum', { age: rules.minCheckinAge })}
              </span>
            ) : null}
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={PawPrint}>
              {t('houseRules.pets.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            {rules?.petsAllowed ? (
              <span>{t('houseRules.pets.allowed')}</span>
            ) : (
              <span>{t('houseRules.pets.notAllowed')}</span>
            )}
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={PartyPopper}>
              {t('houseRules.parties.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            {rules?.partiesAllowed ? (
              <span>{t('houseRules.parties.allowed')}</span>
            ) : (
              <span>{t('houseRules.parties.notAllowed')}</span>
            )}
          </RuleDetail>
        </RuleItemContent>
        <Separator />
      </RuleItem>
      <RuleItem>
        <RuleItemContent>
          <RuleTitle>
            <Text $weight="bold" startIcon={CreditCard}>
              {t('houseRules.payment.title')}
            </Text>
          </RuleTitle>
          <RuleDetail>
            <Badge $color="green" $size="sm">
              {t('houseRules.payment.cash')}
            </Badge>
          </RuleDetail>
        </RuleItemContent>
      </RuleItem>
    </Card.Root>
  );
};
