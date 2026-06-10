// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { styled } from 'styled-components';

import { animation } from '@/shared/styles/animations';
import { media } from '@/shared/styles/breakpoints';
import { mixins } from '@/shared/styles/mixins';
import { colors, radius, typography, zIndex } from '@/shared/styles/variables';

export const Wrapper = styled.section`
  /* Layout */

  /* Box model */
  margin-top: 30px;

  & > a {
    /* Layout */
    ${mixins.display.flex.flexContentCenter}
    flex-direction: column;

    /* Box model */
    padding: 16px;
    border: 1px solid ${colors.separator};

    /* Styling */
    border-radius: ${radius.large};
  }

  @media ${media.minLaptop} {
    & > a {
      /* Layout */
      position: relative;
      align-items: initial;
      justify-content: flex-end;
      flex-direction: initial;
      overflow: hidden;

      /* Box model */
      min-height: 280px;
    }
  }
`;

export const YellowCircle = styled.div`
  /* Layout */
  display: none;
  position: absolute;
  left: -20px;
  bottom: 50px;

  /* Box model */
  width: 64px;
  height: 64px;

  /* Styling */
  background-color: ${colors.yellow[500]};
  border-radius: ${radius.full};

  @media ${media.minLaptop} {
    display: block;
  }

  @media ${media.minDesktop4k} {
    width: 84px;
    height: 84px;
  }
`;

export const ImageContainer = styled.div`
  /* Box model */
  width: 220px;
  margin-bottom: 12px;

  & > img {
    /* Box model */
    width: 100%;
    height: auto;
  }

  @media ${media.minLaptop} {
    /* Layout */
    display: flex;
    align-self: center;

    /* Box model */
    width: 100%;
    height: auto;
    max-width: 390px;
    margin: 16px 32px 0 32px;
  }

  @media ${media.minDesktop4k} {
    margin-left: 82px;
  }
`;

export const Content = styled.div`
  /* Layout */
  ${mixins.display.flex.flexItemCenter}
  flex-direction: column;

  /* Box model */
  width: 100%;

  & > div {
    /* Layout */
    display: flex;
    align-items: center;
    flex-direction: column;

    & > div {
      /* Layout */
      vertical-align: bottom;
      overflow: hidden;

      /* Box model */
      height: 28px;
      line-height: 28px;
    }

    & > div > ul {
      /* Styling */
      font-size: ${typography.fontSize.medium};
      font-weight: ${typography.fontWeight.bold};
      text-align: center;

      /* Animation */
      transition: transform 1s ease-in-out;
      transform: translateY(0);

      animation-name: ${animation.discoverBannerMobile};
      animation-duration: 15s;
      animation-iteration-count: infinite;

      will-change: transform;

      & > li {
        text-decoration: underline;
        text-decoration-color: ${colors.yellow[500]};
      }
    }
  }

  & > button {
    /* Box model */
    width: 100%;
  }

  @media ${media.minLaptop} {
    /* Layout */
    align-items: flex-start;
    justify-content: center;
    z-index: ${zIndex.base};

    /* Box model */
    width: initial;
    min-width: 500px;
    margin: -100px 0;
    padding-left: 10%;

    /* Styling */
    background-color: ${colors.blue[500]};
    border-radius: 50%;

    & > div {
      /* Box model */
      width: 70%;
      display: block;
      color: ${colors.white};

      & > h3 {
        display: inline-block;

        font-size: ${typography.fontSize.extraLarge2} !important;
        line-height: 38px;
      }

      & > div {
        display: inline-block;
        vertical-align: bottom;
        overflow: hidden;

        /* Box model */
        height: 38px;
        margin-left: 8px;

        & > ul {
          font-size: ${typography.fontSize.extraLarge2} !important;
          line-height: 38px;
          text-align: initial;

          /* Animation */
          animation-name: ${animation.discoverBannerDesktop};
        }
      }
    }

    & > button {
      /* Box model */
      max-width: 70%;

      /* Styling */
      background-color: ${colors.white};

      &:hover {
        background-color: ${colors.blue[200]} !important;
        color: ${colors.blue[600]};
      }

      &:active {
        background-color: ${colors.blue[300]} !important;
        color: ${colors.blue[700]};
      }
    }
  }

  @media ${media.minDesktop4k} {
    min-width: 700px;
    margin: -200px 0;
  }
`;

export const ContentWrapper = styled.div`
  @media ${media.minLaptop} {
    display: flex;
    flex-direction: row-reverse;
  }
`;
