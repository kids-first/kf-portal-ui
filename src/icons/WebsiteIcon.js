import { BaseSvg } from 'icons';

export default ({ fill = '#009bb8', size = '1em', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.95 188.95"><defs><style>.cls-1{fill:${fill}}.cls-2{fill:#fff;}</style></defs><circle class="cls-1" cx="94.47" cy="94.47" r="94.47"/><path class="cls-2" d="M126.47,46.47h-64a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16v-64A16,16,0,0,0,126.47,46.47Zm-72,16a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8v16h-80Zm72,72h-64a8,8,0,0,1-8-8v-40h80v40A8,8,0,0,1,126.47,134.47Z"/><circle class="cls-2" cx="66.47" cy="66.47" r="4"/><circle class="cls-2" cx="82.47" cy="66.47" r="4"/><circle class="cls-2" cx="98.47" cy="66.47" r="4"/><path class="cls-2" d="M118.47,98.47h-48a4,4,0,0,0,0,8h48a4,4,0,0,0,0-8Z"/><path class="cls-2" d="M118.47,114.47h-48a4,4,0,0,0,0,8h48a4,4,0,0,0,0-8Z"/></svg>`,
    width,
    height,
    ...props,
  });
