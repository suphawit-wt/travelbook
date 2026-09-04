// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Fragment } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Accordion, Card, Heading, Separator, Text } from '@/shared/ui';

import { TitleGroup } from '../hotel-area/hotel-area.styled';

import { FaqCardGroup, FaqItemWrapper, Wrapper } from './hotel-faq.styled';

import type { FaqGroup, HotelFaqProps } from './hotel-faq.types';
import type { FC } from 'react';

export const HotelFaq: FC<HotelFaqProps> = ({ propertyName }) => {
  const { t } = useTranslation('property');

  const destination = 'Bangkok';

  const faqGroups: FaqGroup[] = [
    {
      id: 'group-1',
      items: [
        {
          id: 'q1',
          question: t('faq.breakfast.title', { propertyName }),
          answer: t('faq.breakfast.answer', {
            propertyName,
            score: 9.6,
          }),
        },
        {
          id: 'q2',
          question: t('faq.pool.title', { propertyName }),
          answer: t('faq.pool.yes'),
        },
        {
          id: 'q3',
          question: t('faq.rooms.title', { propertyName }),
          answer: t('faq.rooms.answer', { propertyName }),
        },
        {
          id: 'q4',
          question: t('faq.checkInOut.title', {
            propertyName,
          }),
          answer: t('faq.checkInOut.answer', {
            propertyName,
            checkIn: '12.00',
            checkOut: '1.00',
          }),
        },
        {
          id: 'q5',
          question: t('faq.price.title', { propertyName }),
          answer: t('faq.price.answer', { propertyName }),
        },
      ],
    },
    {
      id: 'group-2',
      items: [
        {
          id: 'q6',
          question: t('faq.activities.title', { propertyName }),
          answer: t('faq.activities.answer', { propertyName }),
        },
        {
          id: 'q7',
          question: t('faq.location.title', {
            propertyName,
            destination,
          }),
          answer: t('faq.location.answer', {
            propertyName,
            destination,
            distance: '200 m',
          }),
        },
        {
          id: 'q8',
          question: t('faq.beach.title', { propertyName }),
          answer: t('faq.beach.answer', {
            propertyName,
            distance: '200 m',
          }),
        },
        {
          id: 'q9',
          question: t('faq.hotTub.title', { propertyName }),
          answer: t('faq.hotTub.yes', { propertyName }),
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="2xl" as="h2">
          {t('faq.title', { propertyName })}
        </Heading>
      </TitleGroup>
      <FaqCardGroup>
        {faqGroups.map((group) => (
          <Card.Root
            key={group.id}
            $variant="surface"
            style={{
              height: 'fit-content',
              flexBasis: '50%',
            }}
          >
            <Accordion.Root type="multiple">
              {group.items.map(({ id, question, answer }, index) => {
                const isLast = index === group.items.length - 1;

                return (
                  <Fragment key={id}>
                    <FaqItemWrapper>
                      <Accordion.Item value={id}>
                        <Accordion.Trigger>
                          <Text $size="md" $weight="bold">
                            {question}
                          </Text>
                        </Accordion.Trigger>
                        <Accordion.Content asChild>
                          <Text $size="sm">{answer}</Text>
                        </Accordion.Content>
                      </Accordion.Item>
                    </FaqItemWrapper>

                    {!isLast && <Separator />}
                  </Fragment>
                );
              })}
            </Accordion.Root>
          </Card.Root>
        ))}
      </FaqCardGroup>
    </Wrapper>
  );
};
