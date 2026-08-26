// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type {
  Image,
  Review,
} from '@/features/property/lib/property.service.types';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  category: string;
  orientation: 'landscape' | 'portrait';
}

export interface ImagePreviewButtonProps {
  $isActive?: boolean;
}

export interface PhotoGalleryProps {
  propertyName: string;
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
  images: Image[];
}
