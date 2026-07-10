// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

interface Gender {
  key: string;
  label: string;
}

export const genders: Gender[] = [
  {
    key: 'male',
    label: 'personalDetails.gender.male',
  },
  {
    key: 'female',
    label: 'personalDetails.gender.female',
  },
  {
    key: 'non_binary',
    label: 'personalDetails.gender.nonBinary',
  },
  {
    key: 'not_say',
    label: 'personalDetails.gender.notSay',
  },
];
