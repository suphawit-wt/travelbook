// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import type { PropertyServiceInterface } from './property.service.interface';
import type { PropertyType } from './property.service.types';

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
}
