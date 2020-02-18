import { BaseSvg } from 'icons';

export default ({ fill = '#a9adc0', width = '14px', height = '17px', style = {}, ...props }) =>
  BaseSvg({
    svg: `<svg id="Isolation_Mode" data-name="Isolation Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 45.49"><defs><style>.cls-1{fill:${fill};fill-rule:evenodd;}</style></defs><title>icon-demographic</title><path class="cls-1" d="M11.24,31.52c0,4.77-2.78,11.06.23,13.57,2.32,1.93,4.63-3.48,6.94-7.45,2.64-4.53,4-3.57,9.5-4.07,12.8-1.17,10.17-4.61,3.77-5.68-2.38-.4-5.87-.92-7.48-4.43-1.53-3.32.1-6.47,2.65-10.09,3.46-4.9,4.45-7.72-3.12-3.42-7.8,4.44-8.22,5.58-16.41,1.29-11-5.76-7.65.1-2.63,5A21.67,21.67,0,0,1,11.24,31.52Z"/><path class="cls-1" d="M11.53,10.42c-1.91-2.1-1.57-6.64.56-8.58,2.72-2.47,5.12-2.19,6.61-.7C23.88,6.34,15.7,15,11.53,10.42Z"/></svg>`,
    width,
    height,
    style: { ...style },
    ...props,
  });
