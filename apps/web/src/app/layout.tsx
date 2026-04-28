// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { APP } from '@/shared/constants';
import { StyledComponentsRegistry } from '@/shared/providers';
import { GlobalStyles } from '@/shared/styles/globals';

import type { Metadata } from 'next/types';
import type { FC, PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: APP.name,
  applicationName: APP.name,
  description: `Explore the world with ${APP.name}. Big savings on homes, hotels, flights, car rentals, taxis, and attractions - build your perfect trip on any budget.`,
  keywords: [
    'lodging',
    'accommodation',
    'Hotel',
    'Hotels',
    'special offers',
    'packages',
    'specials',
    'weekend breaks',
    'city breaks',
    'deals',
    'budget',
    'cheap',
    'discount',
    'savings',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: APP.name,
    title: `${APP.name}: The largest selection of hotels, homes, and vacation rentals`,
    description:
      "Whether you're looking for hotels, homes, or vacation rentals, you'll always find the guaranteed best price. Browse our 2,563,380 accommodations in over 85,000 destinations.",
    type: 'website',
    locale: 'en_US',
    url: APP.url,
    images: [
      {
        url: 'https://travelbook.suphawit.dev/assets/images/og_img_01.jpg',
      },
    ],
  },
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
