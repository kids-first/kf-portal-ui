import { BaseSvg } from 'icons';

export default ({ fill = '#007ab9', size = '1em', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M46.84,44.14V32.42c0-6.27-3.35-9.19-7.82-9.19A6.75,6.75,0,0,0,32.9,26.6V23.71H26.11c.09,1.92,0,20.43,0,20.43H32.9V32.73a4.66,4.66,0,0,1,.23-1.66,3.7,3.7,0,0,1,3.48-2.48c2.46,0,3.44,1.87,3.44,4.62V44.14ZM19,20.92a3.54,3.54,0,1,0,0-7.06,3.54,3.54,0,1,0-.08,7.06ZM30,60A30,30,0,1,1,60,30,30,30,0,0,1,30,60ZM22.35,44.14V23.71H15.57V44.14Z"/></svg>`,
    width,
    height,
    ...props,
  });
