import { BaseSvg, IconProps } from 'icons';

export default ({ fill = '#fff', width = '24px', height = '24px', style = {} }: IconProps) =>
  BaseSvg({
    // eslint-disable-next-line max-len
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 7.34L16.66 1.69L22.32 7.34L16.66 13L11 7.34ZM11 7.34V11H3V3H11V7.34ZM16.66 13H13V21H21V13H16.66ZM11 21H3V13H11V21Z" fill="${fill}"/></svg>`,
    width,
    height,
    style: { ...style },
  });
