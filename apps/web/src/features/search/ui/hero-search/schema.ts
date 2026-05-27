// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { z } from 'zod';

export const searchSchema = z.object({
  destination: z.string().min(1, { message: 'required' }),
  dates: z.object({
    startDate: z.date(),
    endDate: z.date(),
    key: z.literal('selection'),
  }),
  occupancy: z.object({
    adult: z.number().min(1).max(30),
    children: z.number().min(0).max(10),
    room: z.number().min(1).max(30),
    lookingForApartment: z.boolean(),
    withPets: z.boolean(),
  }),
  showFlights: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
