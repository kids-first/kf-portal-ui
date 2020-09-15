import { BaseSvg } from 'icons';

export default ({ fill = '#a9adc0', width = '12px', height = '16px', ...props }) =>
  BaseSvg({
    // eslint-disable-next-line max-len
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 56"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-files</title><path class="cls-1" d="M44.8,12H34V1.2ZM32,16a2,2,0,0,1-2-2V0H2A2,2,0,0,0,0,2V54a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V16Z"/></svg>`,
    width,
    height,
    ...props,
  });
