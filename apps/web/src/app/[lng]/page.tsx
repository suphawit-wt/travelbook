// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Hero, Offers } from '@/features/home/ui';
import { DefaultLayout } from '@/layouts';
import { Container } from '@/shared/ui';

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <Container>
        <Offers />
      </Container>
    </DefaultLayout>
  );
};

export default Home;
