// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

import { ReviewInfo } from '@/entities/reviews/ui/review-info/review-info';
import { ReviewScore } from '@/entities/reviews/ui/review-score/review-score';
import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import {
  Button,
  Dialog,
  Heading,
  Icon,
  Image,
  Swiper,
  Text,
} from '@/shared/ui';

import {
  CarouselThumbImageWrapper,
  CountryDisplay,
  GalleryGridItem,
  GalleryGridTemplates,
  GalleryGridView,
  GalleryGridViewGroup,
  GalleryGridViewModalWrapper,
  GalleryGroup,
  GalleryGroupBottom,
  GalleryGroupTop,
  GalleryPreviewTitle,
  GallerySideReviews,
  GalleryTopLeft,
  GalleryTopRight,
  ImagePreviewButton,
  ImageViewerWrapper,
  MainSlideFrame,
  ModalContent,
  ModalHeader,
  ModalToolBarButton,
  ModalToolBarLeft,
  ModalToolBarRight,
  MorePhotosOverlay,
  PhotoButtonWrapper,
  ProfileDisplay,
  ReviewerInfo,
  SideReviewItem,
  SideReviewsContent,
  SideReviewsHeader,
  SwiperRoot,
  SwiperThumbRoot,
} from './photo-gallery.styled';

import type { PhotoGalleryProps } from './photo-gallery.types';
import type { FC } from 'react';
import type { Swiper as SwiperClass } from 'swiper';

export const PhotoGallery: FC<PhotoGalleryProps> = ({
  propertyName,
  reviews,
  avgRating,
  reviewCount,
  images,
}) => {
  const { t } = useTranslation(['property', 'reviews', 'country']);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageViewerMode, setImageViewerMode] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeButton = buttonsRef.current[activeIndex];
    if (activeButton) {
      activeButton.focus();
    }
  }, [activeIndex]);

  const displayPhotos = images.slice(0, 8);
  const hasMorePhotos = images.length >= 9;
  const seeMorePhotos = images.length - 8;

  const liveThumbs = useMemo(
    () => (thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null),
    [thumbsSwiper],
  );

  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const onBackToGalleryClick = () => {
    setImageViewerMode(false);
  };

  const openViewerAt = (idx: number) => {
    setPendingIndex(idx);
    setActiveImage(idx);
    setImageViewerMode(true);
  };

  const setActiveImage = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!imageViewerMode || pendingIndex === null) return;
    const s = swiperRef.current;
    if (!s) return;

    // wait 1 frame so Swiper has mounted in the dialog
    const id = requestAnimationFrame(() => {
      s.slideTo(pendingIndex, 0); // main
      liveThumbs?.slideTo(pendingIndex, 0); // thumbs (optional)
    });

    return () => cancelAnimationFrame(id);
  }, [imageViewerMode, pendingIndex, liveThumbs]);

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setImageViewerMode(false);
    }
  };

  return (
    <Dialog.Root open={modalOpen} onOpenChange={handleModalOpenChange}>
      <GalleryGroup>
        {/* ... component UI markup remains exactly the same ... */}
        <GalleryGroupTop>
          <GalleryTopLeft>
            <Dialog.Trigger asChild>
              <ImagePreviewButton
                type="button"
                onClick={() => setActiveImage(0)}
              >
                {displayPhotos[0] ? (
                  <Image
                    alt={`${propertyName} 1`}
                    height={683}
                    src={displayPhotos[0]?.url}
                    width={1024}
                  />
                ) : null}
              </ImagePreviewButton>
            </Dialog.Trigger>
          </GalleryTopLeft>
          <GalleryTopRight>
            {displayPhotos.slice(1, 3).map((photo, index) => (
              <Dialog.Trigger key={photo.id} asChild>
                <ImagePreviewButton
                  type="button"
                  onClick={() => setActiveImage(index + 1)}
                >
                  <Image
                    alt={`${propertyName} ${index + 2}`}
                    height={683}
                    src={photo.url}
                    width={1024}
                  />
                </ImagePreviewButton>
              </Dialog.Trigger>
            ))}
          </GalleryTopRight>
        </GalleryGroupTop>
        <GalleryGroupBottom>
          {displayPhotos.slice(3, 7).map((photo, index) => (
            <Dialog.Trigger key={photo.id} asChild>
              <ImagePreviewButton
                type="button"
                onClick={() => setActiveImage(index + 3)}
              >
                <Image
                  alt={`${propertyName} ${index + 4}`}
                  height={683}
                  src={photo.url}
                  width={1024}
                />
              </ImagePreviewButton>
            </Dialog.Trigger>
          ))}
          <PhotoButtonWrapper>
            <Dialog.Trigger asChild>
              <ImagePreviewButton
                type="button"
                onClick={() => setActiveImage(7)}
              >
                {displayPhotos[7] ? (
                  <Image
                    alt={`${propertyName} 8`}
                    height={683}
                    src={displayPhotos[7]?.url}
                    width={1024}
                  />
                ) : null}
              </ImagePreviewButton>
            </Dialog.Trigger>
            {hasMorePhotos ? (
              <MorePhotosOverlay>
                +{seeMorePhotos} {t('photos')}
              </MorePhotosOverlay>
            ) : null}
          </PhotoButtonWrapper>
        </GalleryGroupBottom>
      </GalleryGroup>

      <Dialog.Portal>
        <Dialog.Overlay />
        <VisuallyHidden>
          <Dialog.Title>Gallery Image Viewer Mode</Dialog.Title>
        </VisuallyHidden>
        <Dialog.Content
          style={{
            overflow: 'hidden',
            maxWidth: 'initial',
            width: '96vw',
            maxHeight: 'initial',
          }}
        >
          <ModalHeader>
            {imageViewerMode ? (
              <ModalToolBarLeft>
                <ModalToolBarButton
                  type="button"
                  onClick={onBackToGalleryClick}
                >
                  <Icon $size="lg" icon={ArrowLeft} />
                  <span>{t('gallery.title')}</span>
                </ModalToolBarButton>
              </ModalToolBarLeft>
            ) : null}

            <GalleryPreviewTitle>
              <Heading
                $size="md"
                $weight="bold"
                as="h2"
                style={{ marginInlineEnd: '10px' }}
              >
                {propertyName}
              </Heading>
              <Button $color="blue" $size="sm" style={{ padding: '10px 16px' }}>
                {t('gallery.actions.reserveNow')}
              </Button>
            </GalleryPreviewTitle>

            <ModalToolBarRight>
              <Dialog.Close asChild>
                <ModalToolBarButton>
                  <span>{t('actions.close')}</span>
                  <Icon $size="lg" icon={X} />
                </ModalToolBarButton>
              </Dialog.Close>
            </ModalToolBarRight>
          </ModalHeader>

          <ModalContent>
            {imageViewerMode ? (
              <ImageViewerWrapper>
                <Swiper.Wrapper>
                  <SwiperRoot
                    loop
                    navigation
                    allowTouchMove={false}
                    modules={[Pagination, Navigation, Thumbs]}
                    spaceBetween={10}
                    thumbs={{ swiper: liveThumbs }}
                    pagination={{
                      type: 'fraction',
                    }}
                    onSlideChange={(swiper) => {
                      setActiveImage(swiper.realIndex);
                    }}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    onDestroy={() => {
                      swiperRef.current = null;
                    }}
                  >
                    {images.map((img, i) => (
                      <Swiper.Slide key={img.id}>
                        <MainSlideFrame>
                          <Image
                            fill
                            alt={`${propertyName} ${i}`}
                            src={img.url}
                          />
                        </MainSlideFrame>
                      </Swiper.Slide>
                    ))}
                  </SwiperRoot>
                </Swiper.Wrapper>

                <Swiper.Wrapper>
                  <SwiperThumbRoot
                    loop
                    allowTouchMove={false}
                    modules={[Navigation, Thumbs]}
                    slidesPerView="auto"
                    spaceBetween={10}
                    style={{ padding: '40px 70px 10px 70px' }}
                    onSwiper={setThumbsSwiper}
                    onDestroy={() => {
                      setThumbsSwiper(null);
                    }}
                  >
                    {images.map((img) => (
                      <Swiper.Slide key={img.id}>
                        <CarouselThumbImageWrapper>
                          <Image fill alt="" src={img.url} />
                        </CarouselThumbImageWrapper>
                      </Swiper.Slide>
                    ))}
                  </SwiperThumbRoot>
                </Swiper.Wrapper>
              </ImageViewerWrapper>
            ) : (
              <GalleryGridView>
                <GalleryGridViewModalWrapper>
                  <GalleryGridViewGroup>
                    <GalleryGridTemplates>
                      {images.map((img, index) => (
                        <GalleryGridItem
                          key={img.id}
                          $orientation={img.orientation}
                        >
                          <ImagePreviewButton
                            ref={(el) =>
                              index === activeIndex && el && el.focus()
                            }
                            $isActive={index === activeIndex}
                            type="button"
                            onClick={() => openViewerAt(index)}
                          >
                            <Image
                              alt={`${propertyName} ${index + 1}`}
                              height={683}
                              src={img.url}
                              width={1024}
                            />
                          </ImagePreviewButton>
                        </GalleryGridItem>
                      ))}
                    </GalleryGridTemplates>
                  </GalleryGridViewGroup>
                </GalleryGridViewModalWrapper>
              </GalleryGridView>
            )}

            <GallerySideReviews>
              <SideReviewsHeader>
                <ReviewInfo
                  $align="left"
                  $weight="medium"
                  rating={avgRating}
                  reviews={reviewCount}
                  variants="stack"
                />
              </SideReviewsHeader>
              <SideReviewsContent>
                <Text $size="sm" as="div" style={{ margin: '16px 0 0 16px' }}>
                  {t('guestsWhoStayedHereLoved', { ns: 'reviews' })}
                </Text>
                {reviews.map((review) => (
                  <SideReviewItem key={review.id}>
                    <Text
                      $size="sm"
                      as="p"
                      style={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                      }}
                    >
                      “{review.comment}”
                    </Text>
                    <ReviewerInfo>
                      <ProfileDisplay>
                        {review.displayName.at(0)}
                      </ProfileDisplay>
                      <Text $size="xs" style={{ marginInlineStart: '6px' }}>
                        {review.displayName}
                      </Text>
                      <CountryDisplay>
                        <Image
                          alt="thai flag"
                          height={12}
                          src="/assets/images/flags/th.png"
                          width={12}
                        />
                        <Text $color="description" $size="xs">
                          {t(review.countryCode, { ns: 'country' })}
                        </Text>
                      </CountryDisplay>
                    </ReviewerInfo>
                  </SideReviewItem>
                ))}
                <SideReviewItem>
                  <Text $size="sm">
                    {t('categories.title', { ns: 'reviews' })}
                  </Text>
                  <ReviewScore
                    $variants="portrait"
                    cleanliness={9.7}
                    comfort={9.7}
                    facilities={9.6}
                    location={9.3}
                    staff={9.6}
                    valueOfMoney={8.8}
                    wifi={7.5}
                  />
                </SideReviewItem>
              </SideReviewsContent>
            </GallerySideReviews>
          </ModalContent>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
