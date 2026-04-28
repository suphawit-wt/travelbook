// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export const device = {
  tablet: '768px',
  laptop: '1024px',
  desktop: '1440px',
  largeDesktop: '1920px',
  desktop4k: '2560px',
};

export const media = {
  minTablet: `only screen and (min-width: ${device.tablet})`,
  maxTablet: `only screen and (max-width: 767px)`,
  minLaptop: `only screen and (min-width: ${device.laptop})`,
  maxLaptop: `only screen and (max-width: 1023px)`,
  minDesktop: `only screen and (min-width: ${device.desktop})`,
  maxDesktop: `only screen and (max-width: 1439px)`,
  minLargeDesktop: `only screen and (min-width: ${device.largeDesktop})`,
  maxLargeDesktop: `only screen and (max-width: 1919px)`,
  minDesktop4k: `only screen and (min-width: ${device.desktop4k})`,
  maxDesktop4k: `only screen and (max-width: 2559px)`,
};
