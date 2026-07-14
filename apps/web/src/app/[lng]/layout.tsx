// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { dir } from 'i18next';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';

import { AuthBootstrap } from '@/features/auth/ui/auth-bootstrap/auth-bootstrap';
import { APP } from '@/shared/constants';
import {
  GoogleAuthProvider,
  ReactQueryProvider,
  StoreProvider,
  StyledComponentsRegistry,
} from '@/shared/providers';
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

interface RootLayoutProps {
  params: {
    lng: string;
  };
}

const RootLayout: FC<PropsWithChildren<RootLayoutProps>> = ({
  params,
  children,
}) => {
  const cookieStore = cookies();
  const hasAuthSession = cookieStore.get('user_refresh_token');

  return (
    <html suppressHydrationWarning dir={dir(params.lng)} lang={params.lng}>
      <body>
        <StoreProvider>
          <ReactQueryProvider>
            <GoogleAuthProvider>
              <AuthBootstrap hasAuthSession={Boolean(hasAuthSession)} />
              <StyledComponentsRegistry>
                <GlobalStyles />
                <ThemeProvider enableSystem={false}>
                  <TooltipProvider delayDuration={500} skipDelayDuration={0}>
                    {children}
                  </TooltipProvider>
                </ThemeProvider>
              </StyledComponentsRegistry>
            </GoogleAuthProvider>
          </ReactQueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
