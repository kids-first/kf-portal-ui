import { BaseSvg, IconProps } from 'icons';

export default ({ fill = '#a9adc0', width = '14px', height = '17px', style = {} }: IconProps) =>
  BaseSvg({
    // eslint-disable-next-line max-len
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 62.88"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-families</title><path class="cls-1" d="M42.32,54.64H33.66a8.1,8.1,0,0,0-8.11,8.1v.14H50.42v-.14A8.1,8.1,0,0,0,42.32,54.64Z"/><circle class="cls-1" cx="37.54" cy="43.35" r="8.31"/><circle class="cls-1" cx="16.66" cy="20.36" r="11.54"/><circle class="cls-1" cx="54.09" cy="11.54" r="11.54"/><path class="cls-1" d="M60.74,25.56h-12a11.26,11.26,0,0,0-10.21,6.53,11.29,11.29,0,0,1,6.37,19.86,11.12,11.12,0,0,1,8.56,10.8v.13H72V36.83A11.27,11.27,0,0,0,60.74,25.56Z"/><path class="cls-1" d="M30.42,52.13A11.27,11.27,0,0,1,29,35.94a11.2,11.2,0,0,0-5.72-1.57h-12A11.26,11.26,0,0,0,0,45.64V62.88H22.55v-.14A11.12,11.12,0,0,1,30.42,52.13Z"/></svg>`,
    width,
    height,
    style: { ...style },
  });
