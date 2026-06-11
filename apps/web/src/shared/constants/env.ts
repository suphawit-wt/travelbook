// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},

  client: {
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:
      process.env['NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID'],
    NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID:
      process.env['NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID'],
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],

    NEXT_PUBLIC_API_BASE_URL: process.env['NEXT_PUBLIC_API_BASE_URL'],
  },
});
