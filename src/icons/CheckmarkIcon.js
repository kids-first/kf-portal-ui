import { BaseSvg } from 'icons';

export default ({ fill = '#40a75a', size = '14px', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94"><defs><style>.cls-1{fill:#fff;stroke:${fill};stroke-miterlimit:10;stroke-width:8px;}.cls-2{fill:#40a75a;}</style></defs><title>icon-checkmark-circle</title><circle class="cls-1" cx="47" cy="47" r="43"/><path class="cls-2" d="M39.57,65.67,24.51,50.61a2.31,2.31,0,0,1,0-3.28l3.28-3.28a2.31,2.31,0,0,1,3.28,0L41.21,54.2,62.94,32.47a2.31,2.31,0,0,1,3.28,0l3.28,3.28a2.31,2.31,0,0,1,0,3.28L42.85,65.67A2.31,2.31,0,0,1,39.57,65.67Z"/></svg>`,
    width,
    height,
    ...props,
  });
