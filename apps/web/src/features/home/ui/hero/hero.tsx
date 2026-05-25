// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { HeroBanner } from './hero-banner/hero-banner';
import { Wrapper } from './hero.styled';

export const Hero = () => {
  return (
    <Wrapper>
      <HeroBanner />
    </Wrapper>
  );
};
