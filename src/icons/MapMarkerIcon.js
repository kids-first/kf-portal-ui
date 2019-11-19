import { BaseSvg } from 'icons';

export default ({ size = '1em', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.83 85.6"><defs><style>.cls-1{fill:#a42c90;}</style></defs><title>icon-location</title><path class="cls-1" d="M34.25.51A34,34,0,0,0,.34,34.42c0,18.33,31.52,49.35,32.86,50.66l1,1,1-1c1.34-1.31,32.87-32.34,32.87-50.66A34,34,0,0,0,34.25.51Zm0,46.44A12.53,12.53,0,1,1,46.79,34.42,12.54,12.54,0,0,1,34.25,47Z" transform="translate(-0.34 -0.51)"/></svg>`,
    width,
    height,
    ...props,
  });
