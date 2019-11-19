import { BaseSvg } from 'icons';

export default ({ size = '1em', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="size_copy" data-name="size copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.46 22.45"><defs><style>.cls-1{fill:#a42c90;}</style></defs><title>icon-mail</title><path class="cls-1" d="M16.68,11.88h0l-.07,0h0l-.08,0h0l-.08,0h0l-.08,0h0l-.09,0h0l-.08,0h0l-.08,0h0L16,12h0l-.08,0h0l-.06,0h0L.4,1.63A3.15,3.15,0,0,0,0,3.16V19.28a3.17,3.17,0,0,0,3.15,3.17H29.31a3.17,3.17,0,0,0,3.15-3.17V3.16A3.09,3.09,0,0,0,32,1.44L16.69,11.87Z"/><path class="cls-1" d="M30.74.35A3.08,3.08,0,0,0,29.31,0H3.15A3.14,3.14,0,0,0,1.52.46l14.71,9.8Z"/></svg>`,
    width,
    height,
    ...props,
  });
