import { BaseSvg, IconProps } from 'icons';

export default ({ fill = '#8a8da8', width = '16px', height = '16px', style = {} }: IconProps) =>
  BaseSvg({
    // eslint-disable-next-line max-len
    svg: `<svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path d="M20.1298 16.1482L12.433 7.22322C12.2126 6.96775 11.7884 6.96775 11.5658 7.22322L3.86889 16.1482C3.58295 16.481 3.84077 16.9685 4.30248 16.9685H19.6962C20.158 16.9685 20.4158 16.481 20.1298 16.1482Z" fill="${fill}"/></svg>
    `,
    width,
    height,
    style: { ...style },
  });
