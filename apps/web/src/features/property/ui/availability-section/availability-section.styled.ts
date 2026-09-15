// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { colors } from '@/shared/styles/variables';

export const AvailabilityGroup = styled.div`
  margin: 20px 0;
`;

export const AvailabilityTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AvailabilityFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const ReservationTable = styled.div`
  display: table;
`;

export const ReservationSummary = styled.div`
  display: table-cell;
  width: 20%;
  padding: 8px;
  padding-top: 0;
  vertical-align: top;
  border: 1px solid ${colors.blue[200]};
  border-right: 0;

  &:has(p) {
    background-color: ${colors.blue[100]};
  }
`;

export const FakeTableHeader = styled.div`
  height: 52px;
  width: 221px;
  background-color: ${colors.indigo[400]};
  top: 0;
  margin-bottom: 0;
  margin-left: -8px;
  margin-right: -8px;
`;

export const ReserveDisplay = styled.div``;

export const TableHeaderPrice = styled.th`
  position: relative;
  background-color: ${colors.indigo[500]} !important;
  vertical-align: top;
  padding: 8px 10px;
`;

export const TableHeaderPriceArrow = styled.div`
  position: absolute;
  background: url('/assets/images/table_header_arrow.png') no-repeat center
    bottom;
  bottom: -9px;
  height: 9px;
  left: 0;
  width: 100%;
`;

export const ChoicesGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ReserveSummaryContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;

  & > button {
    margin-bottom: 10px;
  }
`;

export const FacilityInfoGroup = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
