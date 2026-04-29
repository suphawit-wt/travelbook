'use client';

import { CookiesProvider as ReactCookiesProvider } from 'react-cookie';

import { FC, PropsWithChildren } from 'react';

export const CookiesProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReactCookiesProvider defaultSetOptions={{ path: '/' }}>
      {children}
    </ReactCookiesProvider>
  );
};
