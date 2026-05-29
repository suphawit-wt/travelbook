// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import {
  Hero,
  Offers,
  PropertyType,
  TrendingDestinations,
} from '@/features/home/ui';
import { PropertyServiceMock } from '@/features/property/lib/property.service.mock';
import { DefaultLayout } from '@/layouts';
import { Container } from '@/shared/ui';

const Home = async () => {
  const propertyService = new PropertyServiceMock();

  const propertyTypes = await propertyService.getPropertyTypes();
  const trendingDestinations = await propertyService.getTrendingDestinations();

  return (
    <DefaultLayout>
      <Hero />
      <Container>
        <Offers />
        <PropertyType propertyTypes={propertyTypes} />
        <TrendingDestinations destinations={trendingDestinations} />
      </Container>
    </DefaultLayout>
  );
};

export default Home;
