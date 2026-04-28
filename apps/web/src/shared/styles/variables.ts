// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export const colors = {
  indigo: {
    100: 'var(--color-indigo-100)',
    200: 'var(--color-indigo-200)',
    300: 'var(--color-indigo-300)',
    400: 'var(--color-indigo-400)',
    500: 'var(--color-indigo-500)',
    600: 'var(--color-indigo-600)',
    700: 'var(--color-indigo-700)',
    800: 'var(--color-indigo-800)',
    900: 'var(--color-indigo-900)',
    a1: 'var(--color-indigo-a1)',
    a2: 'var(--color-indigo-a2)',
  },
  blue: {
    100: 'var(--color-blue-100)',
    200: 'var(--color-blue-200)',
    300: 'var(--color-blue-300)',
    400: 'var(--color-blue-400)',
    500: 'var(--color-blue-500)',
    600: 'var(--color-blue-600)',
    700: 'var(--color-blue-700)',
    800: 'var(--color-blue-800)',
    900: 'var(--color-blue-900)',
    a1: 'var(--color-blue-a1)',
    a2: 'var(--color-blue-a2)',
  },
  green: {
    100: 'var(--color-green-100)',
    200: 'var(--color-green-200)',
    300: 'var(--color-green-300)',
    400: 'var(--color-green-400)',
    500: 'var(--color-green-500)',
    600: 'var(--color-green-600)',
    700: 'var(--color-green-700)',
    800: 'var(--color-green-800)',
    900: 'var(--color-green-900)',
    a1: 'var(--color-green-a1)',
    a2: 'var(--color-green-a2)',
  },
  yellow: {
    100: 'var(--color-yellow-100)',
    200: 'var(--color-yellow-200)',
    300: 'var(--color-yellow-300)',
    400: 'var(--color-yellow-400)',
    500: 'var(--color-yellow-500)',
    600: 'var(--color-yellow-600)',
    700: 'var(--color-yellow-700)',
    800: 'var(--color-yellow-800)',
    900: 'var(--color-yellow-900)',
    a1: 'var(--color-yellow-a1)',
    a2: 'var(--color-yellow-a2)',
  },
  orange: {
    100: 'var(--color-orange-100)',
    200: 'var(--color-orange-200)',
    300: 'var(--color-orange-300)',
    400: 'var(--color-orange-400)',
    500: 'var(--color-orange-500)',
    600: 'var(--color-orange-600)',
    700: 'var(--color-orange-700)',
    800: 'var(--color-orange-800)',
    900: 'var(--color-orange-900)',
    a1: 'var(--color-orange-a1)',
    a2: 'var(--color-orange-a2)',
  },
  red: {
    100: 'var(--color-red-100)',
    200: 'var(--color-red-200)',
    300: 'var(--color-red-300)',
    400: 'var(--color-red-400)',
    500: 'var(--color-red-500)',
    600: 'var(--color-red-600)',
    700: 'var(--color-red-700)',
    800: 'var(--color-red-800)',
    900: 'var(--color-red-900)',
    a1: 'var(--color-red-a1)',
    a2: 'var(--color-red-a2)',
  },
  gray: {
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
    a1: 'var(--color-gray-a1)',
    a2: 'var(--color-gray-a2)',
  },
  white: 'var(--color-white)',
  black: 'var(--color-black)',
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  light: {
    base: 'var(--color-light)',
    secondary: 'var(--color-light-secondary)',
    hover: 'var(--color-light-hover)',
  },
  dark: {
    base: 'var(--color-dark)',
    secondary: 'var(--color-dark-secondary)',
    hover: 'var(--color-dark-hover)',
  },
  clear: 'transparent',
  accent: 'var(--color-accent)',
  text: {
    base: 'var(--color-text)',
    description: 'var(--color-text-description)',
  },
  background: {
    base: 'var(--color-background)',
    secondary: 'var(--color-background-secondary)',
  },
  tooltip: 'var(--color-tooltip)',
  dialog: {
    overlay: 'var(--color-dialog-overlay)',
  },
  overlay: {
    base: 'var(--color-overlay)',
    light: 'var(--color-overlay-light)',
    dark: 'var(--color-overlay-dark)',
  },
  popover: {
    base: 'var(--color-popover)',
    secondary: 'var(--color-popover-secondary)',
  },
  shadow: {
    base: 'var(--color-shadow)',
    card: 'var(--color-shadow-card)',
    cardArrow: 'var(--color-shadow-card-arrow)',
  },
  separator: 'var(--color-separator)',
};

export const zIndex = {
  behind: -1,
  base: 0,
  baseOverlay: 10,
  content: 100,
  sticky: 1000,
  dropdown: 1100,
  modal: {
    backdrop: 1200,
    content: 1300,
  },
  tooltip: 1400,
  overlay: {
    backdrop: 1500,
    content: 1600,
  },
};

export const spacing = {
  gap: {
    extraSmall: '0.4rem',
    small: '0.6rem',
    medium: '1rem',
    large: '1.6rem',
    extraLarge: '2.8rem',
  },
};

export const radius = {
  small: '0.4rem',
  medium: '0.6rem',
  large: '0.8rem',
  extraLarge: '1.2rem',
  full: '9999px',
};

export const shadow = {
  small: `${colors.shadow.base} 0px 3px 6px -1px, ${colors.shadow.base} 0px 10px 20px -10px`,
  medium: `${colors.shadow.base} 0px 4px 6px -1px, ${colors.shadow.base} 0px 10px 20px -15px`,
  large: `${colors.shadow.base} 0px 4px 8px -1px, ${colors.shadow.base} 0px 8px 8px -20px`,
};

export const typography = {
  fontSize: {
    extraSmall: '1.2rem',
    small: '1.4rem',
    medium: '1.6rem',
    large: '1.8rem',
    extraLarge: '2.0rem',
    extraLarge2: '2.4rem',
    extraLarge3: '3.0rem',
    extraLarge4: '3.6rem',
    extraLarge5: '4.8rem',
    extraLarge6: '6.0rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
};
