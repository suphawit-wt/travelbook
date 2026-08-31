// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { ChevronRight, MessagesSquare } from 'lucide-react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, ButtonLink, Card, Heading, Icon, Text } from '@/shared/ui';

import {
  LookingQuestion,
  QuestionButton,
  QuestionCardGroup,
  TitleGroup,
  TravelersQuestionCard,
  TravelersQuestionItem,
  Wrapper,
} from './travelers-asking.styled';

import type { TravelersQuestionGroup } from './travelers-asking.types';

export const TravelersAsking = () => {
  const { t } = useTranslation('property');

  const travelersQuestionGroups: TravelersQuestionGroup[] = [
    {
      id: 'card-1',
      questions: [
        { id: 'q1', text: t('asking.questions.breakfast') },
        { id: 'q2', text: t('asking.questions.airportShuttle') },
        { id: 'q3', text: t('asking.questions.parking') },
        { id: 'q4', text: t('asking.questions.restaurant') },
        { id: 'q5', text: t('asking.questions.pool') },
      ],
    },
    {
      id: 'card-2',
      questions: [
        { id: 'q6', text: t('asking.questions.spa') },
        {
          id: 'q7',
          text: t('asking.questions.pets'),
        },
        { id: 'q8', text: t('asking.questions.checkInOut') },
        { id: 'q9', text: t('asking.questions.privateBathroom') },
        { id: 'q10', text: t('asking.questions.wifi') },
      ],
    },
  ];

  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="2xl" as="h2">
          {t('asking.title')}
        </Heading>
        <ButtonLink $color="blue" $size="sm" href="#availability">
          {t('availability.actions.seeAvailability')}
        </ButtonLink>
      </TitleGroup>

      <QuestionCardGroup>
        {travelersQuestionGroups.map((group) => (
          <TravelersQuestionCard key={group.id}>
            {group.questions.map((question) => (
              <TravelersQuestionItem key={question.id}>
                <QuestionButton type="button">
                  <Text $size="sm" startIcon={MessagesSquare}>
                    {question.text}
                  </Text>
                  <Icon icon={ChevronRight} />
                </QuestionButton>
              </TravelersQuestionItem>
            ))}
          </TravelersQuestionCard>
        ))}

        <Card.Root $variant="surface">
          <LookingQuestion>
            <Text $size="xl" $weight="bold">
              {t('asking.helper.stillLooking')}
            </Text>
            <Button
              $color="blue"
              $size="sm"
              $variant="outline"
              style={{ margin: '20px 0' }}
            >
              {t('asking.actions.ask')}
            </Button>
            <Text $size="sm">{t('asking.helper.instantAnswer')}</Text>
          </LookingQuestion>
        </Card.Root>
      </QuestionCardGroup>
    </Wrapper>
  );
};
