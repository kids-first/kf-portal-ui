import React from 'react';

export const encodeSVG = (svg: string) => encodeURI(svg).replace(/#/g, '%23');

export type IconProps = {
  alt?: string;
  fill?: string;
  height?: string;
  style?: object;
  width?: string;
  svgClass?: string;
};

export type BaseSvgProps = {
  svg: string;
  alt?: string;
  fill?: string;
  height?: string;
  size?: string;
  style?: object;
  width?: string;
};

export const BaseSvg = ({
  svg,
  size = '1em',
  height = size,
  width = size,
  style,
  alt = '',
  ...props
}: BaseSvgProps) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
    style={{
      ...style,
      width,
      height,
    }}
    alt={alt}
    {...props}
  />
);
