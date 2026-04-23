import { component } from './settings/index.mjs';

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setGenerator('component', component);
}
