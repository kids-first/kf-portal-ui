import { BaseSvg } from 'icons';

export default ({ fill = '#fff', width = 10, height = 14, ...props }) =>
  BaseSvg({
    svg: `<svg id="Isolation_Mode" data-name="Isolation Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.84 34.63"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-biospecimen</title><path class="cls-1" d="M26.26,27.64l-7.15-12.7a4.35,4.35,0,0,1-.59-2.31V3.69a2,2,0,0,0,1.3-1.8A1.92,1.92,0,0,0,18,0H9a1.89,1.89,0,0,0-.57,3.68v8.94a5.17,5.17,0,0,1-.58,2.31L.59,27.63A4.72,4.72,0,0,0,2.44,34a4.66,4.66,0,0,0,2.27.59H22.14a4.72,4.72,0,0,0,4.7-4.74A4.65,4.65,0,0,0,26.26,27.64Z"/></svg>`,
    width,
    height,
    ...props,
  });
