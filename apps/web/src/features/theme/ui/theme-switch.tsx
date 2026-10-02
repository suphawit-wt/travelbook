// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/shared/i18n/hooks/use-translation';
import { Button, IconButton, Skeleton } from '@/shared/ui';

import type { ThemeSwitchProps } from './theme-switch.types';
import type { FC } from 'react';

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ showTitle }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('common');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- for client render
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <Button $size="lg" $variant="ghost" aria-label="toggle dark mode">
        <Skeleton height="1.8rem" width="1.8rem" />
      </Button>
    );
  }

  if (showTitle) {
    return (
      <Button
        $size="sm"
        $variant="ghost"
        aria-label="toggle dark mode"
        startIcon={theme === 'dark' ? Sun : Moon}
        style={{ justifyContent: 'normal' }}
        onClick={toggleDarkMode}
      >
        {theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
      </Button>
    );
  }

  return (
    <IconButton
      $pressEffect="scale"
      $variant="ghost"
      aria-label="toggle dark mode"
      icon={theme === 'dark' ? Sun : Moon}
      tooltip={t('theme.tooltip')}
      onClick={toggleDarkMode}
    />
  );
};
