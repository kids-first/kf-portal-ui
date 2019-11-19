import { BaseSvg } from 'icons';

export default ({ fill = '#a6278f', size = '12px', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.99 82"><defs><style>.cls-1{fill:${fill}</style></defs><title>icon-table-view</title><path class="cls-1" d="M0,52H85V30H0ZM0,82H85V60H0ZM0,0V22H85V0Z"/></svg>`,
    width,
    height,
    ...props,
  });
