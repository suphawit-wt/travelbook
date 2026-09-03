// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import {
  Bed,
  BedSingle,
  Info,
  LogIn,
  LogOut,
  PartyPopper,
  PawPrint,
  PersonStanding,
} from 'lucide-react';
import { Fragment, useState } from 'react';

import { Accordion, Card, Heading, Link, Separator, Text } from '@/shared/ui';

import {
  ChildPoliciesGroup,
  ExtraBedPoliciesContent,
  ExtraBedPoliciesItem,
  ExtraBedPoliciesTitle,
  FaqItemWrapper,
  InfoItem,
  InfoList,
  RulesItem,
  RulesList,
  Wrapper,
} from './mobile-house-rules.styled';

import type { FaqGroup } from '../../hotel-faq/hotel-faq.types';

export const MobileHouseRules = () => {
  const faqGroups: FaqGroup = {
    id: 'group-1',
    items: [
      {
        id: 'q1',
        question: 'What kind of breakfast is served at Malaya Villa Kohlarn?',
        answer:
          'Guests staying at Malaya Villa Kohlarn can enjoy a highly-rated breakfast during their stay (guest review score: 8.7). Breakfast option(s) include:',
      },
      {
        id: 'q2',
        question: 'Does Malaya Villa Kohlarn have a pool?',
        answer:
          'Yes, this hotel has a pool. See details about the pool and other facilities on this page.',
      },
      {
        id: 'q3',
        question: 'What type of room can I book at Malaya Villa Kohlarn?',
        answer: 'Room options at Malaya Villa Kohlarn include:',
      },
      {
        id: 'q4',
        question:
          'What are the check-in and check-out times at Malaya Villa Kohlarn?',
        answer:
          'Check-in at Malaya Villa Kohlarn is from 14:00, and check-out is until 11:30.',
      },
      {
        id: 'q5',
        question: 'How much does it cost to stay at Malaya Villa Kohlarn?',
        answer:
          "The prices at Malaya Villa Kohlarn may vary depending on your stay (e.g. dates, hotel's policy etc.). To see prices, enter your dates.",
      },
      {
        id: 'q6',
        question: 'What is there to do at Malaya Villa Kohlarn?',
        answer:
          'Malaya Villa Kohlarn offers the following activities/services (charges may apply):',
      },
      {
        id: 'q7',
        question: 'How far is Malaya Villa Kohlarn from the center of Ko Larn?',
        answer: 'Malaya Villa Kohlarn is 200 m from the center of Ko Larn.',
      },
      {
        id: 'q8',
        question: 'How close to the beach is Malaya Villa Kohlarn?',
        answer: 'The nearest beach is 1.2 km from Malaya Villa Kohlarn.',
      },
      {
        id: 'q9',
        question: 'Does Malaya Villa Kohlarn have a hot tub for its guests?',
        answer:
          "Yes, there's a hot tub. You can find out more about this and the other facilities at Malaya Villa Kohlarn on this page.",
      },
    ],
  };

  const [rules, setRules] = useState(['none']);

  const [faq, setFaq] = useState(['none']);

  return (
    <Wrapper>
      <Accordion.Root
        type="multiple"
        value={rules}
        onValueChange={(val) => setRules(val)}
      >
        <InfoList>
          <InfoItem>
            <Accordion.Item value="hotel-policies">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2">
                  Hotel Policies
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <RulesList>
                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={LogIn}
                      style={{ marginBottom: '6px' }}
                    >
                      Check-in
                    </Text>
                    <Text $size="sm" as="div">
                      From 2:00 PM to 9:00 PM
                    </Text>
                  </RulesItem>

                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={LogOut}
                      style={{ marginBottom: '6px' }}
                    >
                      Check-out
                    </Text>
                    <Text $size="sm" as="div">
                      From 11:00 AM to 11:30 AM
                    </Text>
                  </RulesItem>

                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={Info}
                      style={{ marginBottom: '6px' }}
                    >
                      Cancellation/ prepayment
                    </Text>
                    <Text $size="sm" as="div">
                      Cancellation and prepayment policies vary according to
                      accommodation type. Check what&nbsp;
                      <Link
                        $enableHoverColor
                        $color="blue"
                        $underline="always"
                        href="conditions"
                      >
                        conditions
                      </Link>
                      &nbsp; apply to each option when making your selection.
                    </Text>
                  </RulesItem>

                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={PersonStanding}
                      style={{ marginBottom: '6px' }}
                    >
                      Age restriction
                    </Text>
                    <Text $size="sm" as="div">
                      The minimum age for check-in is 18
                    </Text>
                  </RulesItem>

                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={PawPrint}
                      style={{ marginBottom: '6px' }}
                    >
                      Pets
                    </Text>
                    <Text $size="sm" as="div">
                      Pets are not allowed.
                    </Text>
                  </RulesItem>

                  <RulesItem>
                    <Text
                      $weight="bold"
                      as="div"
                      startIcon={PartyPopper}
                      style={{ marginBottom: '6px' }}
                    >
                      Parties
                    </Text>
                    <Text $size="sm" as="div">
                      Parties/events are not allowed
                    </Text>
                  </RulesItem>
                </RulesList>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>

          <InfoItem>
            <Accordion.Item value="children-extra-bed">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2">
                  Children and Extra Beds
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <div>
                  <ChildPoliciesGroup>
                    <Heading
                      $size="sm"
                      $weight="bold"
                      as="h3"
                      style={{ margin: '0 0 16px' }}
                    >
                      Child policies
                    </Heading>
                    <Text $size="sm" as="p" style={{ margin: '1em 0' }}>
                      Children of all ages are welcome.
                    </Text>
                    <Text $size="sm" as="p" style={{ margin: '1em 0' }}>
                      Children 18 and above will be charged as adults at this
                      property.
                    </Text>
                    <Text $size="sm" as="p" style={{ margin: '1em 0' }}>
                      To see correct prices and occupancy info, add the number
                      and ages of children in your group to your search.
                    </Text>
                  </ChildPoliciesGroup>

                  <Heading
                    $size="sm"
                    $weight="bold"
                    as="h3"
                    style={{ margin: '0 0 16px' }}
                  >
                    Crib and extra bed policies
                  </Heading>
                  <ExtraBedPoliciesItem>
                    <ExtraBedPoliciesTitle>0 - 3 years</ExtraBedPoliciesTitle>
                    <ExtraBedPoliciesContent>
                      <Text $size="sm" startIcon={Bed} style={{ flex: '1' }}>
                        Crib upon request
                      </Text>
                      <Text $color="green" $size="sm" style={{ flex: '1' }}>
                        Free
                      </Text>
                    </ExtraBedPoliciesContent>
                  </ExtraBedPoliciesItem>
                  <ExtraBedPoliciesItem>
                    <ExtraBedPoliciesTitle>5+ years</ExtraBedPoliciesTitle>
                    <ExtraBedPoliciesContent>
                      <Text
                        $size="sm"
                        startIcon={BedSingle}
                        style={{ flex: '1' }}
                      >
                        Extra bed upon request
                      </Text>
                      <Text $size="sm" style={{ flex: '1' }}>
                        THB 2,000 per person, per night
                      </Text>
                    </ExtraBedPoliciesContent>
                  </ExtraBedPoliciesItem>
                  <Text $size="sm" as="p" style={{ margin: '1em 0' }}>
                    Prices for cribs and extra beds aren&apos;t included in the
                    total price. They&apos;ll have to be paid for separately
                    during your stay.
                  </Text>
                  <Text $size="sm" as="p">
                    The number of extra beds and cribs allowed depends on the
                    option you choose. Check your selected option for more info.
                  </Text>
                  <Text $size="sm" as="p" style={{ margin: '1em 0' }}>
                    All cribs and extra beds are subject to availability.
                  </Text>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>

          <InfoItem>
            <Accordion.Item value="important-infomation">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2" startIcon={Info}>
                  Important Information
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <Text $size="sm">
                  This property does not accommodate bachelor(ette) or similar
                  parties.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>

          <InfoItem>
            <Accordion.Item value="contact">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2">
                  Contacting the Property
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <div>
                  <Text $size="sm" as="div" style={{ marginBottom: '8px' }}>
                    If you want to request something specific, you can do that
                    after you select your rate.
                  </Text>

                  <Text $size="sm" as="div">
                    After you book, we&apos;ll provide details so you can
                    contact the property directly.
                  </Text>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>

          <InfoItem>
            <Accordion.Item value="partner-program">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2">
                  Preferred Partner Program
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <div>
                  <Text $size="sm">
                    This property is part of our Preferred Partner Program.
                    It&apos;s committed to providing excellent service and good
                    value. It&apos;ll pay us a higher commission if you make a
                    booking.
                  </Text>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>

          <InfoItem>
            <Accordion.Item value="faq">
              <Accordion.Trigger>
                <Heading $size="md" $weight="bold" as="h2">
                  FAQs about Malaya Villa Kohlarn
                </Heading>
              </Accordion.Trigger>
              <Accordion.Content asChild className="AccordionContent">
                <div>
                  <Card.Root $variant="surface">
                    <Accordion.Root
                      type="multiple"
                      value={faq}
                      onValueChange={(val) => setFaq(val)}
                    >
                      {faqGroups.items.map(
                        ({ id, question, answer }, index) => {
                          const isLast = index === faqGroups.items.length - 1;

                          return (
                            <Fragment key={id}>
                              <FaqItemWrapper>
                                <Accordion.Item value={id}>
                                  <Accordion.Trigger>
                                    <Text $size="sm" $weight="bold">
                                      {question}
                                    </Text>
                                  </Accordion.Trigger>
                                  <Accordion.Content
                                    asChild
                                    className="AccordionContent"
                                  >
                                    <div>
                                      <Text $size="sm">{answer}</Text>
                                    </div>
                                  </Accordion.Content>
                                </Accordion.Item>
                              </FaqItemWrapper>

                              {!isLast && <Separator />}
                            </Fragment>
                          );
                        },
                      )}
                    </Accordion.Root>
                  </Card.Root>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </InfoItem>
        </InfoList>
      </Accordion.Root>
    </Wrapper>
  );
};
