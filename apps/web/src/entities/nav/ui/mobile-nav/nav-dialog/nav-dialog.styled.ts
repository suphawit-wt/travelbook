// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

export const Wrapper = styled.div`
  & > nav {
    & > span {
      margin-left: 20px;
    }

    & > ul {
      /* Layout */
      display: flex;
      flex-direction: column;

      /* Box model */
      margin-top: 10px;
      margin-bottom: 50px;

      & > li {
        & > a,
        button {
          display: flex;
          align-items: flex-start;

          width: 100%;
          padding: 18px 18px;

          border-radius: unset;

          & div + span {
            margin-left: 1.5rem;
          }
        }
      }
    }
  }
`;
