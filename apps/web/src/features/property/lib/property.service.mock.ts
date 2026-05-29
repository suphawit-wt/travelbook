// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyServiceInterface } from './property.service.interface';
import type {
  PropertyType,
  TrendingDestination,
} from './property.service.types';

export class PropertyServiceMock implements PropertyServiceInterface {
  async getPropertyTypes(): Promise<PropertyType[]> {
    const data: PropertyType[] = [
      {
        id: 'hotels',
        title: 'hotel',
        image: '/assets/images/property/hotels.jpeg',
        link: 'hotels',
      },
      {
        id: 'apartments',
        title: 'apartment',
        image: '/assets/images/property/apartments.jpeg',
        link: 'apartments',
      },
      {
        id: 'resorts',
        title: 'resort',
        image: '/assets/images/property/resorts.jpeg',
        link: 'resorts',
      },
      {
        id: 'villas',
        title: 'villa',
        image: '/assets/images/property/villas.jpeg',
        link: 'villas',
      },
      {
        id: 'cabins',
        title: 'cabin',
        image: '/assets/images/property/cabins.jpeg',
        link: 'cabins',
      },
    ];

    return Promise.resolve(data);
  }

  async getTrendingDestinations(): Promise<TrendingDestination[]> {
    const data: TrendingDestination[] = [
      {
        id: 'bangkok',
        name: 'Bangkok',
        image: '/assets/images/destinations/bangkok.jpg',
        country: '🇹🇭',
      },
      {
        id: 'chiang-mai',
        name: 'Chiang Mai',
        image: '/assets/images/destinations/chiang_mai.jpg',
        country: '🇹🇭',
      },
      {
        id: 'tokyo',
        name: 'Tokyo',
        image: '/assets/images/destinations/tokyo.jpg',
        country: '🇯🇵',
      },
      {
        id: 'osaka',
        name: 'Osaka',
        image: '/assets/images/destinations/osaka.jpg',
        country: '🇯🇵',
      },
      {
        id: 'pattaya',
        name: 'Pattaya',
        image: '/assets/images/destinations/pattaya.jpg',
        country: '🇹🇭',
      },
    ];

    return Promise.resolve(data);
  }
}
