// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { mixins } from '@/shared/styles/mixins';
import { colors, radius, shadow, typography } from '@/shared/styles/variables';

export const PopoverButton = styled.button`
  /* Layout */
  ${mixins.display.flex.flexContentSpaceBetween}

  /* Box model */
  height: 100%;
  min-height: 40px;
  border: 1px solid ${colors.gray[500]};

  /* Styling */
  background-color: ${colors.background.base};
  user-select: none;
  border-radius: ${radius.small};
  -webkit-text-fill-color: ${colors.text.base} !important;

  &:hover {
    background-color: ${colors.overlay.base};
  }

  & > div:first-child {
    margin-left: 14px;
    margin-right: 8px;
  }

  & > span {
    margin-right: 14px;
  }
`;

export const CalendarWrapper = styled.div`
  .rdrDateRangePickerWrapper {
    display: flex;
  }

  .rdrStaticRangeLabel {
    font-size: ${typography.fontSize.small};
    line-height: 25px;
  }

  .rdrDayToday .rdrDayNumber span:after {
    background-color: ${colors.blue[500]};
  }

  .rdrDayNumber > span {
    color: ${colors.text.base};
  }

  .rdrDayDisabled {
    background-color: ${colors.popover.secondary};
  }

  .rdrDayDisabled > .rdrDayNumber > span {
    color: ${colors.text.description};
  }

  .rdrNextPrevButton {
    background-color: ${colors.popover.secondary};
  }

  .rdrPprevButton i {
    border-color: transparent ${colors.text.base} transparent transparent;
  }

  .rdrNextButton i {
    border-color: transparent transparent transparent ${colors.text.base};
  }

  .datePicker {
    justify-content: space-around;
  }

  .rdrStaticRange {
    border: none;
  }

  .rdrCalendarWrapper {
    background-color: ${colors.popover.base};
  }

  .rdrDateDisplayWrapper {
    background-color: ${colors.popover.secondary};
  }

  .rdrDateDisplayItem {
    background-color: ${colors.popover.base};
  }

  .rdrDateDisplayItem input {
    color: ${colors.text.description};
  }

  .rdrCalendarWrapper,
  .rdrDefinedRangesWrapper {
    flex: 1;
    border: none;
    border-radius: ${radius.small};
    box-shadow: ${shadow.large};
  }

  .rdrMonthAndYearPickers select {
    color: ${colors.text.base};
  }

  .rdrMonthAndYearPickers select:hover {
    background-color: ${colors.overlay.base};
  }

  @media (max-width: 600px) {
    .rdrDateRangePickerWrapper {
      display: block;
    }
    .datePicker {
      display: flex;
      flex-direction: column;
    }
    .rdrMonths {
      flex-direction: column;
    }
  }

  @media (max-width: 768px) {
    .rdrMonths {
      flex-direction: column;
    }
  }
`;
