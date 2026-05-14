// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { OTPInput } from 'input-otp';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { forwardRef } from 'react';

import { Text } from '../text';

import { Slot, SlotGroup, Wrapper } from './input-otp.styled';

import type { InputOTPProps } from './input-otp.types';

export const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(
  ({ $isError, $isSuccess, message, messageType, ...props }, ref) => {
    return (
      <>
        <Wrapper>
          <OTPInput
            {...props}
            ref={ref}
            containerClassName="otp-input"
            spellCheck={false}
            render={({ slots }) => (
              <SlotGroup>
                {slots.map((slot, index) => (
                  <Slot
                    // eslint-disable-next-line react/no-array-index-key -- for otp slot
                    key={index}
                    $isActive={slot.isActive}
                    $isError={$isError}
                    $isSuccess={$isSuccess}
                  >
                    <div>{slot.char}</div>
                  </Slot>
                ))}
              </SlotGroup>
            )}
            onChange={(e) => props.onChange(e)}
          />
        </Wrapper>
        {message && messageType ? (
          <Text
            $color={messageType === 'ERROR' ? 'red' : 'green'}
            $size="sm"
            startIcon={messageType === 'ERROR' ? AlertCircle : CheckCircle2}
          >
            {message}
          </Text>
        ) : null}
      </>
    );
  },
);

InputOTP.displayName = 'InputOTP';
