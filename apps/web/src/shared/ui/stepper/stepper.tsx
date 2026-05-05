// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Check } from 'lucide-react';

import { Icon } from '../icon';

import {
  StepConnector,
  StepItem,
  StepLabel,
  StepMobileLabel,
  StepNumber,
  Wrapper,
} from './stepper.styled';

import type { StepperProps } from './stepper.types';
import type { FC } from 'react';

export const Stepper: FC<StepperProps> = ({ activeStep = 0, steps }) => {
  return (
    <>
      <Wrapper>
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const lastStepIndex = steps.length - 1;

          return (
            <StepItem key={step.id} $isActive={index <= activeStep}>
              <StepNumber>
                {isCompleted ? <Icon $size="sm" icon={Check} /> : index + 1}
              </StepNumber>
              <StepLabel>{step.label}</StepLabel>
              {index < lastStepIndex ? <StepConnector /> : null}
            </StepItem>
          );
        })}
      </Wrapper>
      <StepMobileLabel>{steps[activeStep]?.label}</StepMobileLabel>
    </>
  );
};
