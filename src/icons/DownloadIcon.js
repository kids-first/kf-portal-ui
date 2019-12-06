import { BaseSvg } from './index';

export default ({ fill = '#fff', width = '13px', height = '28px', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 48.24"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-download-grey</title><path class="cls-1" d="M19,28.36l-10-10.24c-2.82-2.83,1.41-7.07,4.23-4.24l3.43,3.46c.78.79,1.42.53,1.42-.58V3a3,3,0,1,1,6,0V16.75c0,1.1.63,1.37,1.42.58l3.43-3.46c2.82-2.83,7.05,1.42,4.23,4.24L23.15,28.34A2.91,2.91,0,0,1,19,28.36ZM36,41.24v-6a3,3,0,0,1,6,0v9a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4v-9a3,3,0,0,1,6,0v6a1,1,0,0,0,1,1H35A1,1,0,0,0,36,41.24Z"/></svg>`,
    width,
    height,
    ...props,
  });
