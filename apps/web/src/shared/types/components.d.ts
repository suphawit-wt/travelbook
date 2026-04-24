// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

export type BaseSize = 'sm' | 'md' | 'lg';

export type IconSize = BaseSize | 'xs';

type ExtraSize = 'xs' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type Size = BaseSize | ExtraSize;

export type TextSize = Size;

export type Weight =
  'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

export type ButtonVariant =
  'solid' | 'soft' | 'surface' | 'outline' | 'ghost' | 'link';

export type AchromaticColor = 'white' | 'black';

export type ColorfulColor =
  'indigo' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray';

export type BaseColor = ColorfulColor | AchromaticColor;

export type IconColor = BaseColor | 'default';

export type AccordionColor = BaseColor | 'default';

export type Border = 'none' | 'solid' | 'shadow';

export type Color = BaseColor;

export type TextColor = BaseColor | 'description';

export type OverlayColor = 'light' | 'dark';

export type Breakpoint = 'mobile' | 'desktop';

export type Direction = 'row' | 'column';

export type Shadow = BaseSize;

export type Align = 'left' | 'center' | 'right';

export type Warp = 'wrap' | 'nowrap' | 'pretty' | 'balance';

export type Underline = 'always' | 'hover';

export type Radius = 'none' | BaseSize | 'xl' | 'full';

export type RadiusPosition = 'all' | 'top';

export type Position = 'start' | 'center' | 'end';

export type Shape = 'circle' | 'rounded';

export type PressEffect = 'scale';
