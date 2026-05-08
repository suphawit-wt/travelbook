// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { Drawer as VaulDrawer } from 'vaul';

import { Content, Description, Overlay, Title } from './drawer.styled';

const Root = VaulDrawer.Root;
const Trigger = VaulDrawer.Trigger;
const Portal = VaulDrawer.Portal;
const Close = VaulDrawer.Close;

export const Drawer = {
  Portal,
  Root,
  Trigger,
  Close,
  Overlay,
  Content,
  Title,
  Description,
};
