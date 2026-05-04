// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import NextImage from 'next/image';
import { css, styled } from 'styled-components';

import { colors, radius, zIndex } from '@/shared/styles/variables';

import type {
  CardContentProps,
  CardImageContainerProps,
  CardRootProps,
} from './card.types';

export const ImageOverlay = styled.div`
  /* Layout */
  position: absolute;
  z-index: ${zIndex.baseOverlay};
  background: linear-gradient(180deg, hsla(0, 0%, 0%, 0.65) 0, transparent);

  /* Box model */
  width: 100%;
  height: 30%;
`;

export const Image = styled(NextImage)`
  /* Layout */
  position: absolute;
  object-fit: cover;
  z-index: ${zIndex.base};

  /* Box model */
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.div<CardImageContainerProps>`
  /* Layout */
  position: relative;
  overflow: hidden;

  /* Box model */
  height: 300px;
  max-height: 210px;

  & > button {
    /* Layout */
    position: absolute;
    top: 8px;
    right: 8px;

    /* Box model */
    padding: 8px 9px;
  }

  ${(props) => {
    switch (props.$radiusPosition) {
      case 'all':
        return css`
          border-radius: ${radius.large};
        `;
      case 'top':
        return css`
          border-top-left-radius: ${radius.large};
          border-top-right-radius: ${radius.large};
        `;
      default:
        return css``;
    }
  }}

  & > img {
    /* Layout */
    position: absolute;
    object-fit: cover;

    /* Box model */
    width: 100%;
    height: 100%;

    /* Animation */
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }

  & > a > img {
    /* Layout */
    position: absolute;
    object-fit: cover;

    /* Box model */
    width: 100%;
    height: 100%;

    /* Animation */
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const Content = styled.div<CardContentProps>`
  /* Layout */
  z-index: ${zIndex.content};

  ${(props) => {
    switch (props.$padding) {
      case 'sm':
        return css`
          padding: 12px;
        `;
      case 'md':
        return css`
          padding: 14px;
        `;
      case 'lg':
        return css`
          padding: 16px;
        `;
      case 'xl':
        return css`
          padding: 20px;
        `;
      default:
        return css``;
    }
  }}
`;

export const Root = styled.div<CardRootProps>`
  /* Layout */

  /* Styling */
  border-radius: ${radius.large};

  &:hover > ${ImageOverlay} {
    background: linear-gradient(180deg, hsla(0, 0%, 0%, 0.85) 0, transparent);
  }

  ${(props) => {
    switch (props.$padding) {
      case 'xs':
        return css`
          padding: 8px;
        `;
      case 'sm':
        return css`
          padding: 12px;
        `;
      case 'md':
        return css`
          padding: 14px;
        `;
      case 'lg':
        return css`
          padding: 16px;
        `;
      case 'xl':
        return css`
          padding: 20px;
        `;
      default:
        return css``;
    }
  }}

  ${(props) => {
    switch (props.$variant) {
      case 'surface':
        return css`
          border: 1px solid ${colors.separator};
        `;
      case 'classic':
        return css`
          box-shadow: 0px 1px 8px -4px ${colors.shadow.card};
        `;
      case 'ghost':
        return css`
          &:hover {
            background-color: ${colors.overlay.base};
          }
        `;
      default:
        return css``;
    }
  }}
`;
