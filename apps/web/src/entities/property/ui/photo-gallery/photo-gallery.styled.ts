// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { css, styled } from 'styled-components';

import { media } from '@/shared/styles/breakpoints';
import { colors, radius, typography, zIndex } from '@/shared/styles/variables';
import { Swiper } from '@/shared/ui';

import { type ImagePreviewButtonProps } from './photo-gallery.types';

export const PhotoButtonWrapper = styled.div`
  position: relative;
  flex-shrink: 1;
  flex-grow: 1;
  flex-basis: 100%;
`;

export const MorePhotosOverlay = styled.span`
  position: absolute;
  background-color: hsla(0, 0%, 0%, 0.5);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-content: center;
  text-align: center;
  border-radius: 4px;
  color: ${colors.white};
  font-weight: ${typography.fontWeight.bold};
  text-decoration: underline;
  cursor: pointer;
  pointer-events: none;
`;

export const ImagePreviewButton = styled.button<ImagePreviewButtonProps>`
  width: 100%;
  height: 100%;
  display: inline-flex;
  vertical-align: top;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;

  /* Layout */
  position: relative;
  overflow: hidden;

  /* Box model */
  width: 100%;
  height: 100%;
  border-radius: 4px;

  & > img {
    position: absolute;
    object-fit: cover;
    z-index: ${zIndex.base};
    transition: transform 0.3s;

    /* Box model */
    width: 100%;
    height: 100%;
  }

  &:hover {
    & > img {
      transform: scale(1.05);
    }
  }

  &:focus {
    box-shadow: 0 0 0 2px ${colors.blue[500]};
  }

  ${(props) =>
    props.$isActive &&
    css`
      box-shadow: 0 0 0 2px ${colors.blue[500]};
    `}
`;

export const ModalToolBarLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 16px;
  height: 100%;
`;

export const ModalToolBarRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 16px;
  height: 100%;
`;

export const ModalToolBarButton = styled.button`
  position: static;
  display: inline-flex;
  align-items: center;
  font-size: ${typography.fontSize.small};
  background-color: transparent;
  gap: 6px;
  padding: 8px;
  height: 100%;

  &:hover {
    color: ${colors.blue[500]};
  }
`;

export const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 2000;
  box-sizing: border-box;
  max-width: 100vw;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: 1px solid ${colors.separator};
`;

export const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  /* Bound the content so children can scroll inside */
  height: min(90dvh, 95vh);
  max-height: min(90dvh, 95vh);
  overflow: hidden;

  @media ${media.minLaptop} {
    grid-template-columns: 1fr 270px; /* main + side reviews */
  }
`;

export const GalleryPreviewTitle = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const GalleryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 470px;
`;

export const GalleryGroupTop = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-grow: initial;
  gap: 10px;
  height: 359px;
`;

export const GalleryTopLeft = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
`;

export const GalleryTopRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 33%;
  height: 100%;
  flex-grow: initial;
  flex-shrink: 0;
  gap: 10px;
`;

export const GalleryGroupBottom = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-shrink: 0;
  flex-grow: initial;
  height: 103px;
`;

export const GalleryGridView = styled.div`
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const GalleryGridViewModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
`;

export const GalleryGridViewGroup = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const GalleryGridTemplates = styled.div`
  display: grid;
  height: fit-content;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(auto, 200px);
  gap: 16px;

  @media ${media.minTablet} {
    grid-template-columns: repeat(4, 1fr);
  }

  @media ${media.minLaptop} {
    grid-template-columns: repeat(6, 1fr);
  }

  @media ${media.minDesktop} {
    grid-template-columns: repeat(8, 1fr);
  }

  @media ${media.minLargeDesktop} {
    grid-template-columns: repeat(10, 1fr);
  }
`;

interface GridItemProps {
  $orientation: 'landscape' | 'portrait';
}

export const GalleryGridItem = styled.div<GridItemProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  min-width: 100px;
  min-height: 150px;
  grid-column: span 2;

  ${(props) => {
    switch (props.$orientation) {
      case 'landscape':
        return css`
          grid-row: span 1;
        `;
      case 'portrait':
        return css`
          grid-row: span 2;
        `;
      default:
        return css``;
    }
  }};
`;

export const GallerySideReviews = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* contain inner scroll */
  border-left: 1px solid ${colors.separator};
`;

export const SideReviewsHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 2000;
  border-bottom: 1px solid ${colors.separator};
  box-shadow: 0 2px 4px hsla(0, 0%, 0%, 0.05);
  padding: 16px;
`;

export const SideReviewsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 40px;
`;

export const SideReviewItem = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid ${colors.separator};
`;

export const ReviewerInfo = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

export const ProfileDisplay = styled.div`
  width: 24px;
  height: 24px;
  font-size: ${typography.fontSize.extraSmall};
  border-radius: ${radius.full};
  background-color: ${colors.green[700]};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

export const CountryDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 10px;
`;

export const ImageViewerWrapper = styled.div``;

export const CarouselThumbImageWrapper = styled.div`
  display: inline-flex;
  vertical-align: top;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  aspect-ratio: 4 / 3;

  /* Layout */
  position: relative;
  overflow: hidden;

  /* Box model */
  width: 100%;
  height: 100%;
  min-height: 76px;
  border-radius: 4px;

  & > img {
    position: absolute;
    object-fit: cover;
    z-index: ${zIndex.base};
    transition: transform 0.3s;

    /* Box model */
    width: 100%;
    height: 100%;
  }
`;

export const SwiperRoot = styled(Swiper.Root)`
  padding-top: 20px;

  .swiper-pagination {
    display: flex;
    justify-content: center;
    margin-bottom: -27px; /* lands between stage and thumbs */
    font-size: 18px;
    pointer-events: none;
  }

  .swiper-button-next,
  .swiper-button-prev {
    /* Styling */
    background-color: transparent;
    color: ${colors.text.base};
    box-shadow: none;

    width: 50px;
    height: 50px;

    &:hover {
      background-color: ${colors.overlay.base};
    }

    &::after {
      font-size: ${typography.fontSize.large};
    }
  }

  .swiper-button-next {
    right: 10px;
  }

  .swiper-button-prev {
    left: 10px;
  }
`;

export const SwiperThumbRoot = styled(Swiper.Root)`
  .swiper-slide {
    width: 80px;
    opacity: 0.6;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }

  .swiper-slide-thumb-active ${CarouselThumbImageWrapper} {
    outline: 2px solid ${colors.blue[500]};
    border-radius: 4px;
  }

  img:hover {
    transform: scale(1.05);
  }
`;

export const MainSlideFrame = styled.div`
  /* Layout */
  width: min(92%, 1060px);
  height: clamp(420px, 68vh, 700px);
  margin: 12px auto 0;
  padding: 8px; /* soft inner padding like Booking */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Look */
  border-radius: 8px;
  overflow: hidden;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }
`;

export const MainSlideImageWrapper = styled.div``;
