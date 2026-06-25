// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import FacebookLogin, {
  type RenderProps,
} from 'react-facebook-login/dist/facebook-login-render-props';

import { AuthService } from '@/features/auth/lib/auth.service';
import { setAccessToken } from '@/features/auth/store/auth.slice';
import { env } from '@/shared/constants';
import { useAppDispatch } from '@/shared/hooks/store';

import { SignInWithButton } from './sign-in-with.styled';

import type { ReactFacebookLoginInfo } from 'react-facebook-login';

export const SignInWithFacebookButton = () => {
  const authService = new AuthService();
  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useAppDispatch();
  const next = search.get('next');

  return (
    <FacebookLogin
      appId={env.NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={async (response: ReactFacebookLoginInfo) => {
        if (!response.accessToken) return;

        const accessToken = await authService.userFacebookSignIn(
          response.accessToken,
        );

        dispatch(setAccessToken(accessToken));
        router.replace(next ?? '/');
      }}
      render={(renderProps: RenderProps) => (
        <SignInWithButton onClick={renderProps.onClick}>
          <svg
            aria-hidden="true"
            focusable="false"
            height="24"
            role="img"
            style={{ fill: '#4267b2' }}
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
          </svg>
        </SignInWithButton>
      )}
    />
  );
};
