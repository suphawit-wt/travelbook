// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
:root {
    /* Color */
    --color-indigo-100: hsl(216, 40%, 95%);
    --color-indigo-200: hsl(216, 40%, 85%);
    --color-indigo-300: hsl(216, 40%, 80%);
    --color-indigo-400: hsl(216, 40%, 50%);
    --color-indigo-500: hsl(216, 100%, 30%);
    --color-indigo-600: hsl(216, 100%, 25%);
    --color-indigo-700: hsl(216, 100%, 20%);
    --color-indigo-800: hsl(216, 100%, 15%);
    --color-indigo-900: hsl(216, 100%, 10%);
    --color-indigo-a1: hsla(216, 100%, 30%, 0.15);
    --color-indigo-a2: hsla(216, 100%, 30%, 0.25);

    --color-blue-100: hsl(211, 95%, 95%);
    --color-blue-200: hsl(211, 95%, 85%);
    --color-blue-300: hsl(211, 95%, 80%);
    --color-blue-400: hsl(211, 55%, 45%);
    --color-blue-500: hsl(211, 95%, 40%);
    --color-blue-600: hsl(211, 95%, 35%);
    --color-blue-700: hsl(211, 95%, 30%);
    --color-blue-800: hsl(211, 95%, 25%);
    --color-blue-900: hsl(211, 95%, 20%);
    --color-blue-a1: hsla(211, 95%, 40%, 0.15);
    --color-blue-a2: hsla(211, 95%, 40%, 0.25);

    --color-green-100: hsl(146, 40%, 95%);
    --color-green-200: hsl(146, 40%, 85%);
    --color-green-300: hsl(146, 40%, 80%);
    --color-green-400: hsl(146, 40%, 65%);
    --color-green-500: hsl(146, 100%, 30%);
    --color-green-600: hsl(146, 100%, 25%);
    --color-green-700: hsl(146, 100%, 20%);
    --color-green-800: hsl(146, 100%, 15%);
    --color-green-900: hsl(146, 100%, 10%);
    --color-green-a1: hsla(146, 100%, 30%, 0.15);
    --color-green-a2: hsla(146, 100%, 30%, 0.25);

    --color-yellow-100: hsl(48, 100%, 95%);
    --color-yellow-200: hsl(48, 100%, 85%);
    --color-yellow-300: hsl(48, 100%, 80%);
    --color-yellow-400: hsl(48, 100%, 65%);
    --color-yellow-500: hsl(48, 100%, 50%);
    --color-yellow-600: hsl(48, 100%, 45%);
    --color-yellow-700: hsl(48, 100%, 40%);
    --color-yellow-800: hsl(48, 100%, 35%);
    --color-yellow-900: hsl(48, 100%, 30%);
    --color-yellow-a1: hsla(48, 100%, 50%, 0.15);
    --color-yellow-a2: hsla(48, 100%, 50%, 0.25);

    --color-orange-100: hsl(36, 100%, 95%);
    --color-orange-200: hsl(36, 100%, 85%);
    --color-orange-300: hsl(36, 100%, 80%);
    --color-orange-400: hsl(36, 100%, 65%);
    --color-orange-500: hsl(36, 100%, 50%);
    --color-orange-600: hsl(36, 100%, 45%);
    --color-orange-700: hsl(36, 100%, 40%);
    --color-orange-800: hsl(36, 100%, 35%);
    --color-orange-900: hsl(36, 100%, 30%);
    --color-orange-a1: hsla(36, 100%, 50%, 0.15);
    --color-orange-a2: hsla(36, 100%, 50%, 0.25);

    --color-red-100: hsl(0, 75%, 95%);
    --color-red-200: hsl(0, 75%, 85%);
    --color-red-300: hsl(0, 75%, 80%);
    --color-red-400: hsl(0, 75%, 65%);
    --color-red-500: hsl(0, 75%, 50%);
    --color-red-600: hsl(0, 75%, 45%);
    --color-red-700: hsl(0, 75%, 40%);
    --color-red-800: hsl(0, 75%, 35%);
    --color-red-900: hsl(0, 75%, 30%);
    --color-red-a1: hsla(0, 75%, 50%, 0.15);
    --color-red-a2: hsla(0, 75%, 50%, 0.25);

    --color-gray-100: hsl(0, 0%, 95%);
    --color-gray-200: hsl(0, 0%, 85%);
    --color-gray-300: hsl(0, 0%, 80%);
    --color-gray-400: hsl(0, 0%, 65%);
    --color-gray-500: hsl(0, 0%, 50%);
    --color-gray-600: hsl(0, 0%, 45%);
    --color-gray-700: hsl(0, 0%, 40%);
    --color-gray-800: hsl(0, 0%, 35%);
    --color-gray-900: hsl(0, 0%, 30%);
    --color-gray-a1: hsla(0, 0%, 50%, 0.15);
    --color-gray-a2: hsla(0, 0%, 50%, 0.25);

    --color-white: hsl(0, 0%, 100%);
    --color-black: hsl(0, 0%, 0%);

    /* Color Abstract */
    --color-primary: var(--color-indigo-500);
    --color-secondary: var(--color-blue-600);
    --color-light: hsl(0, 0%, 90%);
    --color-light-secondary: hsl(0, 0%, 85%);
    --color-dark: hsl(0, 0%, 10%);
    --color-dark-secondary: hsl(0, 0%, 15%);

    --color-overlay-light: hsla(0, 0%, 100%, 0.10);
    --color-overlay-dark: hsla(0, 0%, 0%, 0.10);

    --color-dialog-overlay-light: hsla(0, 0%, 100%, 0.25);
    --color-dialog-overlay-dark: hsla(0, 0%, 0%, 0.25);

    --color-accent: var(--color-blue-100);
    --color-text: var(--color-dark);
    --color-text-description: var(--color-gray-600);
    --color-background: var(--color-white) !important;
    --color-background-secondary: var(--color-gray-100);
    --color-tooltip: var(--color-dark);
    --color-overlay: var(--color-overlay-dark);
    --color-dialog-overlay: var(--color-dialog-overlay-dark);
    --color-popover: var(--color-white);
    --color-popover-secondary: var(--color-gray-100);
    --color-shadow: hsla(0, 0%, 0%, 0.35);
    --color-shadow-card: hsla(0, 0%, 0%, 0.75);
    --color-shadow-card-arrow: hsla(0, 0%, 0%, 0.15);
    --color-separator: var(--color-gray-200);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

html[data-theme='dark'] {
    --color-text: var(--color-light);
    --color-text-description: var(--color-gray-500);
    --color-background: var(--color-dark-secondary) !important;
    --color-background-secondary: var(--color-dark);
    --color-tooltip: hsl(0, 0%, 20%);
    --color-overlay: var(--color-overlay-light);
    --color-dialog-overlay: var(--color-dialog-overlay-light);
    --color-popover: var(--color-dark-secondary);
    --color-popover-secondary: var(--color-dark);
    --color-shadow: hsla(216, 45%, 55%, 0.35);
    --color-shadow-card: hsla(216, 55%, 75%, 0.75);
    --color-shadow-card-arrow: hsla(216, 55%, 75%, 0.15);
    --color-separator: var(--color-gray-900);
}

body {
    font-size: 1.6rem;
    font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;

    color: var(--color-text);
    background-color: var(--color-background);
}

button {
    border: none;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
    }
}

svg {
    color: inherit;
}

ul {
    list-style: none;
}

hr {
    height: 1px;
    margin: 5px 0;
    
    background-color: var(--color-separator);
    border: none;
}

h1, h2, h3, h4, h5, h6 {
    font-family: "Inter", BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
`;
