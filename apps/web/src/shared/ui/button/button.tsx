// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

'use client';

import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

import { Icon } from '../icon';
import { Tooltip } from '../tooltip';

import { StyledButton } from './button.styled';

import type { ButtonProps } from './button.types';
import type { PropsWithChildren } from 'react';

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      children,
      startIcon,
      endIcon,
      tooltip,
      loading,
      type = 'button',
      $iconSize = 'md',
      ...props
    },
    ref,
  ) => {
    const buttonContent = (
      <StyledButton ref={ref} type={type} {...props}>
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            style={{ display: 'inline-flex' }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            }}
          >
            <Icon icon={Loader2} />
          </motion.div>
        ) : (
          <>
            {startIcon ? <Icon $size={$iconSize} icon={startIcon} /> : null}
            {children ? <span>{children}</span> : null}
            {endIcon ? <Icon $size={$iconSize} icon={endIcon} /> : null}
          </>
        )}
      </StyledButton>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} side="bottom" sideOffset={8}>
          {buttonContent}
        </Tooltip>
      );
    }

    return buttonContent;
  },
);

Button.displayName = 'Button';
