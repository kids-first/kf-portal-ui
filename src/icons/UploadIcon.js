import { BaseSvg } from 'icons';

export default ({ fill = '#fff', size = '1em', width = size, height = size, ...props }) =>
  BaseSvg({
    svg: `<svg id="Isolation_Mode" data-name="Isolation Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 48.24"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-upload-white</title><path class="cls-1" d="M23,.88l10,10.24c2.82,2.83-1.41,7.07-4.23,4.24l-3.43-3.45c-.78-.79-1.42-.53-1.42.58V26.25a3,3,0,0,1-6,0V12.49c0-1.1-.63-1.37-1.42-.58l-3.43,3.45c-2.82,2.83-7-1.41-4.23-4.24L18.85.9A2.91,2.91,0,0,1,23,.88ZM36,41.24v-6a3,3,0,0,1,6,0v9a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4v-9a3,3,0,0,1,6,0v6a1,1,0,0,0,1,1H35A1,1,0,0,0,36,41.24Z" transform="translate(0 0)"/></svg>`,
    width,
    height,
    ...props,
  });
