// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { MessagesSquare } from 'lucide-react';

import { Button, Heading, Icon, Text } from '@/shared/ui';

import { TitleGroup, Wrapper } from './property-q-and-a.styled';

export const PropertyQAndA = () => {
  return (
    <Wrapper>
      <TitleGroup>
        <Heading $size="xl" $weight="bold" as="h2">
          Property questions and answers
        </Heading>
        <Icon $size="lg" icon={MessagesSquare} />
      </TitleGroup>
      <Text $size="sm" as="p" style={{ marginBottom: '16px' }}>
        Send a question to the property to find out more.
      </Text>
      <Button
        $color="blue"
        $pressEffect="scale"
        $variant="ghost"
        style={{ padding: '0px' }}
      >
        Ask a question
      </Button>
    </Wrapper>
  );
};
