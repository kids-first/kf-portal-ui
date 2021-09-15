import { BaseSvg, IconProps } from 'icons';

export default ({ fill = '#a9adc0', width = '24px', height = '24px', style = {} }: IconProps) =>
  BaseSvg({
    // eslint-disable-next-line max-len
    svg: `<svg width="${width}" height="${height}" viewBox="0 0 12 12" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 2.5V9.5H9.5V6H10.5V9.5C10.5 10.05 10.05 10.5 9.5 10.5H2.5C1.945 10.5 1.5 10.05 1.5 9.5V2.5C1.5 1.95 1.945 1.5 2.5 1.5H6V2.5H2.5ZM7 2.5V1.5H10.5V5H9.5V3.205L4.585 8.12L3.88 7.415L8.795 2.5H7Z" fill="${fill}"/></svg>`,
    width,
    height,
    style: { ...style },
  });
