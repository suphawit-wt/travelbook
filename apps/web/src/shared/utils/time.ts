// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export const timeBuilder = {
  seconds: (s: number) => s * 1000,
  minutes: (m: number) => m * 60 * 1000,
  hours: (h: number) => h * 60 * 60 * 1000,
};
