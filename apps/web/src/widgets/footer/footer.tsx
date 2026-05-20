// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { FooterInfo } from './footer-info/footer-info';
import { FooterLinks } from './footer-links/footer-links';
import { FooterNav } from './footer-nav/footer-nav';

export const Footer = () => {
  return (
    <footer>
      <FooterLinks />
      <FooterNav />
      <FooterInfo />
    </footer>
  );
};
