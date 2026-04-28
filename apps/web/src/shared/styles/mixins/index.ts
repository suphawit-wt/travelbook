// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { badgeColor, badgeSize } from './badge';
import { borderRadius } from './box-model';
import {
  buttonPressEffect,
  buttonShadow,
  buttonSize,
  buttonVariant,
  iconButtonSize,
} from './button';
import {
  flexColumnFlexStart,
  flexContentCenter,
  flexContentSpaceBetween,
  flexItemCenter,
  flexItemCenterWithGap,
  showOnly,
} from './display';
import { iconColor, iconSize } from './icon';
import {
  fontBaseColor,
  fontColor,
  fontSize,
  fontWeight,
  linkColor,
  textAlign,
  textShadow,
  textUnderline,
} from './typography';

export const mixins = {
  badge: {
    badgeSize,
    badgeColor,
  },
  boxModel: {
    borderRadius,
  },
  button: {
    buttonSize,
    buttonShadow,
    buttonVariant,
    buttonPressEffect,
    iconButtonSize,
  },
  display: {
    flex: {
      flexItemCenter,
      flexItemCenterWithGap,
      flexContentCenter,
      flexContentSpaceBetween,
      flexColumnFlexStart,
    },
    showOnly,
  },
  typography: {
    fontBaseColor,
    fontColor,
    fontSize,
    fontWeight,
    textUnderline,
    textShadow,
    textAlign,
    linkColor,
  },
  icon: {
    iconColor,
    iconSize,
  },
};
