// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export interface AuthServiceInterface {
  userSignIn: (email: string) => Promise<void>;
  userVerifyEmail: (email: string, otp: string) => Promise<string>;
  userRefreshToken: () => Promise<string>;
  userSignOut: () => Promise<void>;
  userGoogleSignIn: (authCode: string) => Promise<string>;
  userFacebookSignIn: (accessToken: string) => Promise<string>;
}
